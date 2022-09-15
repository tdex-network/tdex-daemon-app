/* eslint-disable */
// @generated by protobuf-ts 2.8.1 with parameter add_pb_suffix,eslint_disable,ts_nocheck,keep_enum_prefix,long_type_number
// @generated from protobuf file "tdex-daemon/v1/wallet.proto" (package "tdex_daemon.v1", syntax proto3)
// tslint:disable
// @ts-nocheck
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { WalletService } from "./wallet_pb";
import type { SendToManyResponse } from "./wallet_pb";
import type { SendToManyRequest } from "./wallet_pb";
import type { WalletBalanceResponse } from "./wallet_pb";
import type { WalletBalanceRequest } from "./wallet_pb";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { WalletAddressResponse } from "./wallet_pb";
import type { WalletAddressRequest } from "./wallet_pb";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 *
 * Service for Liquidity Providers to manage funds via wallet RPC
 *
 * @generated from protobuf service tdex_daemon.v1.WalletService
 */
export interface IWalletServiceClient {
    /**
     * WalletAddress returns a Liquid confidential p2wpkh address (BLECH32)
     *
     * @generated from protobuf rpc: WalletAddress(tdex_daemon.v1.WalletAddressRequest) returns (tdex_daemon.v1.WalletAddressResponse);
     */
    walletAddress(input: WalletAddressRequest, options?: RpcOptions): UnaryCall<WalletAddressRequest, WalletAddressResponse>;
    /**
     * WalletBalance returns total unspent outputs (confirmed and unconfirmed),
     * all confirmed unspent outputs and all unconfirmed unspent outputs under
     * controll of the wallet.
     *
     * @generated from protobuf rpc: WalletBalance(tdex_daemon.v1.WalletBalanceRequest) returns (tdex_daemon.v1.WalletBalanceResponse);
     */
    walletBalance(input: WalletBalanceRequest, options?: RpcOptions): UnaryCall<WalletBalanceRequest, WalletBalanceResponse>;
    /**
     * SendToMany sends funds to many outputs
     *
     * @generated from protobuf rpc: SendToMany(tdex_daemon.v1.SendToManyRequest) returns (tdex_daemon.v1.SendToManyResponse);
     */
    sendToMany(input: SendToManyRequest, options?: RpcOptions): UnaryCall<SendToManyRequest, SendToManyResponse>;
}
/**
 *
 * Service for Liquidity Providers to manage funds via wallet RPC
 *
 * @generated from protobuf service tdex_daemon.v1.WalletService
 */
export class WalletServiceClient implements IWalletServiceClient, ServiceInfo {
    typeName = WalletService.typeName;
    methods = WalletService.methods;
    options = WalletService.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * WalletAddress returns a Liquid confidential p2wpkh address (BLECH32)
     *
     * @generated from protobuf rpc: WalletAddress(tdex_daemon.v1.WalletAddressRequest) returns (tdex_daemon.v1.WalletAddressResponse);
     */
    walletAddress(input: WalletAddressRequest, options?: RpcOptions): UnaryCall<WalletAddressRequest, WalletAddressResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<WalletAddressRequest, WalletAddressResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * WalletBalance returns total unspent outputs (confirmed and unconfirmed),
     * all confirmed unspent outputs and all unconfirmed unspent outputs under
     * controll of the wallet.
     *
     * @generated from protobuf rpc: WalletBalance(tdex_daemon.v1.WalletBalanceRequest) returns (tdex_daemon.v1.WalletBalanceResponse);
     */
    walletBalance(input: WalletBalanceRequest, options?: RpcOptions): UnaryCall<WalletBalanceRequest, WalletBalanceResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<WalletBalanceRequest, WalletBalanceResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * SendToMany sends funds to many outputs
     *
     * @generated from protobuf rpc: SendToMany(tdex_daemon.v1.SendToManyRequest) returns (tdex_daemon.v1.SendToManyResponse);
     */
    sendToMany(input: SendToManyRequest, options?: RpcOptions): UnaryCall<SendToManyRequest, SendToManyResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<SendToManyRequest, SendToManyResponse>("unary", this._transport, method, opt, input);
    }
}
