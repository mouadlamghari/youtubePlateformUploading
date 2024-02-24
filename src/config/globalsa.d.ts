declare global{
    namespace NodeJS{
        interface ProccessEnv{
            DB_URL:string,
            CLIENT_SECRET:string,
            PORT:string,
            SESSION_SECRET:string,
            CLIENT_ID:string,
            DB_CONNECT:string,
            PASSWORD:string,
            SECRECT_JWT_ACCESS_PRIVATE:string,
            SECRECT_JWT_REFRESH:string
        }
    }
}
export {}