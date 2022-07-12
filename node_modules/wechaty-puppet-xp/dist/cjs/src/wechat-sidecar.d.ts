import { SidecarBody } from 'sidecar';
declare class WeChatSidecar extends SidecarBody {
    getTestInfo(): Promise<string>;
    getChatroomMemberNickInfo(memberId: string, roomId: string): Promise<string>;
    isLoggedIn(): Promise<boolean>;
    getMyselfInfo(): Promise<string>;
    getChatroomMemberInfo(): Promise<string>;
    getWeChatVersion(): Promise<number>;
    getWechatVersionString(): Promise<string>;
    checkSupported(): Promise<Boolean>;
    callLoginQrcode(forceRefresh: boolean): Promise<null>;
    getContact(): Promise<string>;
    sendMsg(contactId: string, text: string): Promise<string>;
    sendAttatchMsg(contactId: string, path: string): Promise<string>;
    sendPicMsg(contactId: string, path: string): Promise<string>;
    sendAtMsg(roomId: string, text: string, contactId: string): Promise<string>;
    SendMiniProgram(BgPathStr: string, contactId: string, xmlstr: string): Promise<string>;
    recvMsg(msgType: number, contactId: string, text: string, groupMsgSenderId: string, xmlContent: string, isMyMsg: number): Promise<any>;
    checkQRLogin(status: number, qrcodeUrl: string, wxid: string, avatarUrl: string, nickname: string, phoneType: string, phoneClientVer: number, pairWaitTip: string): Promise<any>;
    logoutEvent(bySrv: number): Promise<any>;
    loginEvent(): Promise<any>;
    agentReady(): Promise<any>;
}
export { WeChatSidecar };
//# sourceMappingURL=wechat-sidecar.d.ts.map