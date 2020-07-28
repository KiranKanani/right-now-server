require("dotenv").config()
const config = {
    expireTime: process.env.JWTEXPIRE, //jwt expire time
    secrets: {
      JWT_SECRET: process.env.JWTSECRET //jwt secret
    },
    db: {
      url: process.env.DBURL //database url
    },
    port: process.env.PORT, //port on which our site running
  }
  
  export default config