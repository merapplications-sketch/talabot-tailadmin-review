/** Authored synthetic response envelopes for isolated financial UI testing.
 * NOT reconstructed from ledger rows, NOT server observations, NOT balances of real users.
 * Source signatures: cash(driverId), walletOf(userId), refundRoom(ticketId).
 * Existing frozen fixtures are retained unchanged; these additional scenarios are explicit.
 */
export const syntheticCash:Record<string,number>={u2:1250};
export const syntheticWallets:Record<string,{balance:number}>={u3:{balance:50},'pv-cust62':{balance:0}};
export const syntheticRefundRooms:Record<string,{total:number;refunded:number;room:number}>={t1:{total:126,refunded:20,room:106}};
