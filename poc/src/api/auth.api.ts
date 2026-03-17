import instance from "./axios";

const STATIC_PUBLIC_KEY = "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1Gd3dEUVlKS29aSWh2Y05BUUVCQlFBRFN3QXdTQUpCQUxmQUp0Uy9ZcjVWSCtNUTVUZmkvTG1zNUZldDNMM3g2SUNYMW9zME15RWpjUC9ldmFGdFYrZkJOTTBKRG5WQ3h3alZwRkNHaElybkt1S3d1Y2pUUndrQ0F3RUFBUT09DQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=";

export const preAuthHandshake = async () => {
    try {
        const response = await instance.post('/v1/api/auth/pre-auth-handshake', {
            devicePublicKey: STATIC_PUBLIC_KEY
        });
        return response.data;
    } catch (error: any) {
        console.error("Handshake Error:", error.response?.data || error.message);
        throw error;
    }
};


export const login = async (username : string , password : string) => {
   const body ={
      username : username,
      password : password
   };


   try {
      const response = await instance.post('/v1/api/auth/login', body);
      return response.data;
   } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message);
      throw error;
   }
}



export const validateOtp = async(username : string, otpValue : string) => {
    const body = {
        username : username,
        otp : parseInt(otpValue , 10)
    }
    

    try {
        const response = await instance.post('/v2/api/auth/validate-otp', body);
        return response.data;
    }
    catch (error: any) {
        console.error("OTP Validation Error:", error.response?.data || error.message);
        throw error;
    }
}

export const forgotUserId = async (panNumber: string, emailId: string) => {
  try {
    const response = await instance.post('/v1/api/auth/forgot-user-id', {
      panNumber,
      emailId
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};