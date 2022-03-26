import './listWebhooks.less';
import { DeleteOutlined, SafetyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import { useEffect } from 'react';

import { useListWebhooksQuery, useRemoveWebhookMutation } from '../../operator.api';

export const ListWebhooks = (): JSX.Element => {
  const { data: listWebhooks, error: listWebhooksError } = useListWebhooksQuery();
  const [removeWebhook] = useRemoveWebhookMutation();

  useEffect(() => {
    if (listWebhooksError) {
      console.error('ListWebhooks', listWebhooksError);
    }
  }, [listWebhooksError]);

  const onDelete = async (endpointId: string) => {
    try {
      await removeWebhook({ id: endpointId });
    } catch (err) {
      console.error('removeWebhook', err);
    }
  };

  return (
    <div className="list-webhooks">
      {listWebhooks?.length
        ? listWebhooks?.map(({ id, endpoint, isSecured }) => (
            <div key={id} className="endpoint mb-4">
              <span> {endpoint}</span>
              <div>
                <span className={classNames({ 'secured-active': isSecured }, 'secured')}>
                  <SafetyOutlined />
                </span>
                <Button type="primary" icon={<DeleteOutlined />} onClick={() => onDelete(id)} />
              </div>
            </div>
          ))
        : 'No webhooks'}
    </div>
  );
};
