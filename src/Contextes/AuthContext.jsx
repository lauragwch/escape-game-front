import { createContext } from 'react';

const AuthContext = createContext({
  isConnected: false,
  setIsConnected: () => {},
  role: null,
  setRole: () => {},
  user: null,
  setUser: () => {},
});

export default AuthContext;