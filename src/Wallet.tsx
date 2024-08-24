// WalletComponent.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Wallet from './Wallet';
import { Offering, Exchange } from './types';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Button = styled.button`
  padding: 10px 15px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Input = styled.input`
  padding: 10px;
  margin: 5px;
  width: 200px;
`;

const Select = styled.select`
  padding: 10px;
  margin: 5px;
  width: 200px;
`;

const WalletComponent: React.FC = () => {
  const [wallet] = useState(new Wallet());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedPfi, setSelectedPfi] = useState('');
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    wallet.initialize();
  }, [wallet]);

  const handleRegister = async () => {
    await wallet.register(email, password, name);
    alert('Registered successfully!');
  };

  const handleLogin = async () => {
    await wallet.login(email, password);
    alert('Logged in successfully!');
  };

  const handleAddFunds = async () => {
    const currency = prompt('Enter currency code:');
    const amount = parseFloat(prompt('Enter amount:') || '0');
    if (currency && amount) {
      await wallet.addFunds(currency, amount);
      alert('Funds added successfully!');
    }
  };

  const handleFetchOfferings = async () => {
    if (selectedPfi) {
      await wallet.fetchOfferings(selectedPfi);
    }
  };

  const handleCreateExchange = async () => {
    if (selectedOffering && amount) {
      await wallet.createExchange(selectedOffering.id, parseFloat(amount));
      alert('Exchange created successfully!');
    }
  };

  const handleAcceptQuote = async (exchangeId: string) => {
    await wallet.acceptQuote(exchangeId);
    alert('Quote accepted successfully!');
  };

  const handleRateExchange = async (exchangeId: string) => {
    const rating = parseInt(prompt('Rate this exchange (1-5):') || '0');
    if (rating >= 1 && rating <= 5) {
      await wallet.rateExchange(exchangeId, rating);
      alert('Exchange rated successfully!');
    }
  };

  return (
    <Container>
      <h1>tbDEX Wallet</h1>
      <div>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={handleRegister}>Register</Button>
        <Button onClick={handleLogin}>Login</Button>
      </div>
      {wallet.state.user && (
        <>
          <h2>Welcome, {wallet.state.user.name}!</h2>
          <Button onClick={handleAddFunds}>Add Funds</Button>
          <Button onClick={wallet.getVerifiableCredential}>Get Verifiable Credential</Button>
          <div>
            <h3>Balances:</h3>
            {Object.entries(wallet.state.balance).map(([currency, amount]) => (
              <p key={currency}>{currency}: {amount}</p>
            ))}
          </div>
          <div>
            <h3>PFIs:</h3>
            <Select onChange={(e) => setSelectedPfi(e.target.value)}>
              <option value="">Select a PFI</option>
              {wallet.state.pfiList.map((pfi) => (
                <option key={pfi.did} value={pfi.did}>{pfi.name}</option>
              ))}
            </Select>
            <Button onClick={handleFetchOfferings}>Fetch Offerings</Button>
          </div>
          <div>
            <h3>Offerings:</h3>
            <Select onChange={(e) => setSelectedOffering(wallet.state.offerings.find(o => o.id === e.target.value) || null)}>
              <option value="">Select an offering</option>
              {wallet.state.offerings.map((offering) => (
                <option key={offering.id} value={offering.id}>
                  {offering.data.payin.currencyCode} to {offering.data.payout.currencyCode}
                </option>
              ))}
            </Select>
            <Input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Button onClick={handleCreateExchange}>Create Exchange</Button>
          </div>
          <div>
            <h3>Exchanges:</h3>
            {wallet.state.exchanges.map((exchange: Exchange) => (
              <div key={exchange.id}>
                <p>ID: {exchange.id}</p>
                <p>Status: {exchange.status}</p>
                <p>Payin: {exchange.payinAmount} {exchange.payinCurrency}</p>
                <p>Payout: {exchange.payoutAmount} {exchange.payoutCurrency}</p>
                {exchange.status === 'quote' && (
                  <Button onClick={() => handleAcceptQuote(exchange.id)}>Accept Quote</Button>
                  // WalletComponent.tsx (continued)

                )}
                {exchange.status === 'close' && !exchange.rating && (
                  <Button onClick={() => handleRateExchange(exchange.id)}>Rate Exchange</Button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </Container>
  );
};

export default WalletComponent;