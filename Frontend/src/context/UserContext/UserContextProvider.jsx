import { useState, useEffect } from "react";
import userService from "../../service/userService";
import { useAuth } from "../AuthContext/AuthContext";
import UserContext from "./UserContext";

export const UserContextProvider = ({ children }) => {
  const { user,logout,refreshUser } = useAuth();

  const deleteUser = async() => {
    try {
       const response = await userService.deleteUser();
       if(response) logout(); 
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

    const editUser = async({name,pfImage}) => {
        try{
       const response = await  userService.editUser({name,pfImage});
       if(response) refreshUser();
    } catch (error) {
      console.error("Error editing user:", error);
    }
  };
  return (
    <UserContext.Provider
      value={{
        deleteUser,
        editUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
