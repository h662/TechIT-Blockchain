import { Box, Button } from "@chakra-ui/react";
import { useState } from "react";

const App = () => {
  const [account, setAccount] = useState("");

  const getAccount = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
      } else {
        alert("Install MetaMask!!!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logOut = () => {
    setAccount("");
  };

  return (
    <Box minH="100vh">
      <Box bgColor="yellow.100" px={4} py={8} textAlign="center">
        {account ? (
          <Box fontWeight="bold">
            Hello, {account.substring(0, 4)}...
            {account.substring(account.length - 4)}
            <Button ml={4} colorScheme="yellow" onClick={logOut}>
              LogOut
            </Button>
          </Box>
        ) : (
          <Button colorScheme="yellow" onClick={getAccount}>
            MetaMask
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default App;
