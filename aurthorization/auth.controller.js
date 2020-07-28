import {Users} from '../api/user'
import bcrypt from 'bcrypt-nodejs'
import jwt, { decode } from 'jsonwebtoken'
import configKey from '../config'
import nodemailer from 'nodemailer'
import {FirebaseNotification} from '../api/realTimeAndNotification/notification.modal'
// mail object
const smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: "shubhamkanani.dds@gmail.com",
      pass: 'Sh9825784600'
    }
  });

//Registration api

export const signup = async (req,res) =>{
    try{
        const {email,password,mobileToken} = req.body;
        const emailId = email.toLowerCase();
        const isEmailExist = await Users.findOne({emailId: emailId});
        if(isEmailExist){
            return res
                    .status(422)
                    .send({ success: false, message: "Email is alrady exist" });
        }
        const user = await Users.create({
            emailId,
            password:bcrypt.hashSync(password),
        })
        await FirebaseNotification.create({userId:user._id,
          mobileToken:mobileToken
        })
        return res.status(201).send({
            success: true,
            token: tokenForUser(emailId),
            userId:user._id,
            message: "User created successfully."
          });
    }
    catch(err){
        res.status(422).send({ success: false, message: err.message });
        
    }
}

//token genration

const expirationInterval =
    (process.env.NODE_ENV === "development")? 30 * 24 * 60 * 60: (parseInt(process.env.JWTSECRET) || 1) * 24 * 60 * 60;

const tokenForUser = (emailId) => {
    try {
      //console.log(user.emailId)
      const timestamp = new Date().getTime();
      return jwt.sign(
        {
          sub: emailId,
          iat: timestamp,
          // entityDetails: loginDetails.relatedFaEntities[0],
          exp: Math.floor(Date.now() / 1000) + expirationInterval
        },
        configKey.secrets.JWT_SECRET
      );
    } 
    catch (err) {
      throw err;
    }
  };

//signin api

export const signin = async (req,res) => {
    const {email,password,mobileToken} = req.body;
    try{
        const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(emailRegexp.test(email)){
               const userExistence = await Users.findOne({emailId:email.toLowerCase()})
               if(!userExistence){
                  return res.status(422).send({
                    success: false,
                    message: `Either Password or EmailId Doesn't match`
                  });
              }
              const validPassword = await bcrypt.compareSync(password, userExistence.password);
                //console.log(validPassword)
                if(!validPassword){
                  return res.status(422).send({
                    success: false,
                    message: `Password is Incorrect Please try Again later`
                  });
                }
                const mobileTokenExist = await FirebaseNotification.findOne({userId:userExistence._id})
                if(mobileTokenExist){
                  console.log('enter')
                  const daat = await FirebaseNotification.findOneAndUpdate({userId:userExistence._id},{
                    mobileToken:mobileToken
                  })
                }
                else{
                  await FirebaseNotification.create({userId:userExistence._id,
                    mobileToken:mobileToken
                  })
                }
                  return res.status(200).send({
                    success: true,
                    userId:userExistence._id,
                    token: tokenForUser(userExistence.email)
                  });
            }
    }
    catch(err){
        res.status(422).send({
            success: false,
            error: `Unable to Login using email - ${email}`
          });
    }
}

//forget password

export const forgotPassword = async (req,res) =>{
  try{
    let {email} = req.body
    const emailId = email.toLowerCase();
    const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegexp.test(emailId)) {
        return res.status(422).send({ success: false, message: "Invalid Email" });
      }
    const isEmailExist = await Users.findOne({emailId:emailId}).then(data => {
        return data ? true : false;
      });
      if (!isEmailExist) {
        return res
          .status(422)
          .send({ success: false, message: "email in not registered" });
      }
      const token = tokenForUser(req.body);
      const data = {
        to: emailId,
        from: process.env.MAILER_EMAIL_ID,
        subject: "Click Below Link To Reset Password ",
        text:
          "Confirm your email address to get started.\n\n" +
          "Please click on the following link, or paste this into your browser to the reset password process:\n\n" +
          "http://localhost:8080/auth/resetpassword?token=" +
          token +
          "\n\n" +
          "If you did not need this, please ignore this email and your password will remain unchanged.\n"
      };
      await smtpTransport.sendMail(data, err => {
        return err ? res.status(422).send({
              success: false,
              message: err
            }) : res.status(200).send({
              success: true,
              message: "please check your email to reset your password!"
            });
      });
  }
  catch(err) {
    res.status(200).send({
      success:false,
      message:err.message
    })
  }
    
}

//reset password api

export const resetpassword = async(req,res) =>{
  try{
      const token = req.query.token; //JWT
      const decoded  = jwt.decode(token);
      await Users.findOneAndUpdate(
        { emailId: decoded.sub },
        { password: bcrypt.hashSync(req.body.password) }
      )
      return res.status(200).send({
        success:true,
        message:"your password change successfully"
      })
  }
  catch(err){
    res.status(422).send({ success: false, message: err.message });
  }
}