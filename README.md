  const connectWallet = async () => {
    try {
      if (!web3Modal) {
        console.error("Web3Modal not initialized.");
        return;
      }
      const instance = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      setProvider(provider);
      setAddress(address);
  
      // Fetch USDT balance
      const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
      const usdtAbi = ["function balanceOf(address) view returns (uint256)"];
      const usdtContract = new ethers.Contract(usdtContractAddress, usdtAbi, provider);
      const usdtBalance = await usdtContract.balanceOf(address);
      setUsdtBalance(ethers.utils.formatUnits(usdtBalance, 6));
  
      // Fetch ETH balance
      const ethBalance = await provider.getBalance(address);
      setEthBalance(ethers.utils.formatEther(ethBalance));
  
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };