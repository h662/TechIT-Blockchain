import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useState } from "react";
import Web3 from "web3";
import { MINT_NFT_ABI, MINT_NFT_CONTRACT } from "./web3.config";
import axios from "axios";

const web3 = new Web3(window.ethereum);

const mintContract = new web3.eth.Contract(MINT_NFT_ABI, MINT_NFT_CONTRACT);

const App = () => {
  const [account, setAccount] = useState("");
  const [src, setSrc] = useState("");

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

  const mint = async () => {
    try {
      if (!account) return;

      const mintNFT = await mintContract.methods
        .mintNFT()
        .send({ from: account });

      if (mintNFT.status) {
        const balanceOf = await mintContract.methods.balanceOf(account).call();

        const tokenByIndex = await mintContract.methods
          .tokenByIndex(balanceOf - 1)
          .call();

        const tokenURI = await mintContract.methods
          .tokenURI(tokenByIndex)
          .call();

        const response = await axios.get(tokenURI);

        setSrc(response.data.image);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Box
        position="absolute"
        width="100%"
        bgColor="yellow.100"
        px={4}
        py={8}
        textAlign="center"
      >
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
      <Flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        {src ? (
          <Image src={src} alt="NFT" />
        ) : (
          <Box width={512} height={512} bgColor="gray.100" border="2px" />
        )}
        <Button mt={8} onClick={mint}>
          Minting
        </Button>
      </Flex>
    </Box>
  );
};

export default App;
