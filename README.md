# Dependencies
# Truffle Version Used
Truffle v5.4.32 (core: 5.4.32)

# Open Zeppelin Version
OpenZeppelin ^4.5.0

# Token Info
Token Name: "StarNotary"
Token Symbol: "SNC"

# Token Link on Rinkeby for SNC Token
https://rinkeby.etherscan.io/token/0x7cfd2d94f68d72b5e3e5abf487b52c19a3a7a2ab

# Smart Contract Address
0x483efd8a95f002f52cca9722ed3d61bbf5ea9a5a

# Notes - Issues
I had all kinds of issues with this older version of Truffle, so I had to remove and use newer version

```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version