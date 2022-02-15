import { once } from '@tauri-apps/api/event';
import { exit } from '@tauri-apps/api/process';
import type { Child } from '@tauri-apps/api/shell';
import { Command } from '@tauri-apps/api/shell';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import type { RootState } from './app/store';
import { useTypedDispatch, useTypedSelector } from './app/store';
import { ServiceUnavailableModal } from './common/ServiceUnavailableModal';
import Shell from './common/Shell';
import { connectProxy, healthCheckProxy, setProxyHealth } from './features/settings/settingsSlice';
import { useExponentialInterval } from './hooks/useExponentialInterval';
import { Routes } from './routes';
import { sleep } from './utils';

export const App = (): JSX.Element => {
  const dispatch = useTypedDispatch();
  const { useProxy, proxyHealth, macaroonCredentials, tdexdConnectUrl } = useTypedSelector(
    ({ settings }: RootState) => settings
  );
  const [isServiceUnavailableModalVisible, setIsServiceUnavailableModalVisible] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const proxyChildProcess = useRef<Child | null>(null);

  useEffect(() => {
    (async () => {
      // Enable copy/paste on Tauri app
      document.addEventListener('keypress', function (event) {
        if (event.metaKey && event.key === 'c') {
          document.execCommand('copy');
          event.preventDefault();
        }
        if (event.metaKey && event.key === 'v') {
          document.execCommand('paste');
          event.preventDefault();
        }
      });

      if (useProxy) {
        // Register close app event for cleanup
        await once('quit-event', async () => {
          try {
            setIsExiting(true);
            dispatch(setProxyHealth('NOT_SERVING'));
          } catch (err) {
            console.error('err', err);
          }
        });
      }
    })();
    // eslint-disable-next-line
  }, []);

  // Exit after cleanup
  useEffect(() => {
    (async () => {
      if (proxyChildProcess.current?.pid && isExiting && proxyHealth === 'NOT_SERVING') {
        // Need to sleep the time to write in persistent storage
        await sleep(250);
        // Delete local storage to avoid rehydration issues
        localStorage.removeItem('persist:root');
        await proxyChildProcess.current?.kill();
        await exit();
      }
    })();
  }, [isExiting, proxyChildProcess, proxyHealth]);

  const startProxy = useCallback(async () => {
    if (!proxyChildProcess.current?.pid) {
      const command = Command.sidecar('grpcproxy');
      command.on('close', (data) => {
        console.log(`grpcproxy command finished with code ${data.code} and signal ${data.signal}`);
      });
      command.on('error', (error) => console.error(`grpcproxy command error: "${error}"`));
      command.stdout.on('data', (line) => console.log(`grpcproxy command stdout: "${line}"`));
      command.stderr.on('data', (line) => console.log(`grpcproxy command stderr: "${line}"`));
      proxyChildProcess.current = await command.spawn();
      console.log('Proxy pid:', proxyChildProcess.current?.pid);
    }
  }, []);

  const startAndConnectToProxy = useCallback(async () => {
    if (useProxy && proxyHealth !== 'SERVING' && !isExiting) {
      // Start proxy
      await startProxy();
      // Health check
      const { desc } = await dispatch(healthCheckProxy()).unwrap();
      if (desc === 'SERVING_NOT_CONNECTED') {
        // If onboarded, try to connect to proxy
        if (macaroonCredentials && tdexdConnectUrl) {
          // Connect
          await dispatch(connectProxy()).unwrap();
          // Recheck health status
          const { desc } = await dispatch(healthCheckProxy()).unwrap();
          if (desc === 'SERVING') {
            console.log('gRPC Proxy:', desc);
          } else {
            console.log('gRPC Proxy:', desc);
          }
        }
        // If the HTTP call fails
      } else if (desc === 'NOT_SERVING') {
        console.error('gRPC Proxy:', desc);
      }
    }
  }, [useProxy, proxyHealth, isExiting, startProxy, dispatch, macaroonCredentials, tdexdConnectUrl]);

  // Update health proxy status every x seconds
  // Try to restart proxy if 'Load failed' error
  useExponentialInterval(() => {
    if (useProxy && proxyChildProcess.current?.pid && !isExiting) {
      (async () => {
        try {
          await dispatch(healthCheckProxy()).unwrap();
        } catch (err) {
          // Restart proxy
          if (err === 'Load failed') {
            try {
              // Reset proxyHealth manually because healthCheckProxy thunk is throwing before setting it
              dispatch(setProxyHealth(undefined));
              console.log('Restart proxy');
              await startProxy();
            } catch (err) {
              console.log('Restart failure', err);
            }
          }
        }
      })();
    }
  }, 125);

  // Start and connect to gRPC proxy
  useEffect(() => {
    if (useProxy) {
      (async () => {
        const startAndConnectToProxyRetry = async (retryCount = 0, lastError?: string): Promise<void> => {
          if (retryCount > 5) throw new Error(lastError);
          try {
            await startAndConnectToProxy();
          } catch (err) {
            await sleep(2000);
            // @ts-ignore
            await startAndConnectToProxyRetry(retryCount + 1, err);
          }
        };
        try {
          await startAndConnectToProxyRetry();
        } catch (err) {
          console.error('startAndConnectToProxyRetry error', err);
          setIsServiceUnavailableModalVisible(true);
        }
      })();
    }
  }, [proxyHealth, startAndConnectToProxy, useProxy]);

  return (
    <>
      <Shell>
        <Routes setIsServiceUnavailableModalVisible={setIsServiceUnavailableModalVisible} />
        <ServiceUnavailableModal
          isServiceUnavailableModalVisible={isServiceUnavailableModalVisible}
          setIsServiceUnavailableModalVisible={setIsServiceUnavailableModalVisible}
        />
      </Shell>
    </>
  );
};
