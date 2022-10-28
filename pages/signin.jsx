import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import axios from "axios";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

function SignIn() {
	const { connectAsync } = useConnect();
	const { disconnectAsync } = useDisconnect();
	const { isConnected } = useAccount();
	const { signMessageAsync } = useSignMessage();
	const { push } = useRouter();

	const handleMetamaskAuth = async () => {
		if (isConnected) {
			await disconnectAsync();
		}

		const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() });

		const userData = { address: account, chain: chain.id, network: "evm" };

		const { data } = await axios.post("/api/auth/request-message", userData, {
			headers: {
				"content-type": "application/json",
			},
		});

		const message = data.message;

		const signature = await signMessageAsync({ message });

		// redirect user after success authentication to '/user' page
		const { url } = await signIn("credentials", { message, signature, redirect: false, callbackUrl: "/user" });
		/**
		 * instead of using signIn(..., redirect: "/user")
		 * we get the url from callback and push it to the router to avoid page refreshing
		 */
		push(url);
	};

	const handleWalletConnectAuth = async () => {
		if (isConnected) {
			await disconnectAsync();
		}
		// added WalletConnectConnector
		const { account, chain } = await connectAsync({
			connector: new WalletConnectConnector({
				options: {
					qrcode: true,
				},
			}),
		});

		const userData = { address: account, chain: chain.id, network: "evm" };

		const { data } = await axios.post("/api/auth/request-message", userData, {
			headers: {
				"content-type": "application/json",
			},
		});

		const message = data.message;

		const signature = await signMessageAsync({ message });

		// redirect user after success authentication to '/user' page
		const { url } = await signIn("credentials", { message, signature, redirect: false, callbackUrl: "/user" });
		/**
		 * instead of using signIn(..., redirect: "/user")
		 * we get the url from callback and push it to the router to avoid page refreshing
		 */
		push(url);
	};

	const handleCoinbaseAuth = async () => {
		if (isConnected) {
			await disconnectAsync();
		}

		const { account, chain } = await connectAsync({
			connector: new CoinbaseWalletConnector({
				options: {
					appName: "instapay.com",
				},
			}),
		});

		const userData = { address: account, chain: chain.id, network: "evm" };

		const { data } = await axios.post("/api/auth/request-message", userData, {
			headers: {
				"content-type": "application/json",
			},
		});

		const message = data.message;

		const signature = await signMessageAsync({ message });

		// redirect user after success authentication to '/user' page
		const { url } = await signIn("credentials", {
			message,
			signature,
			redirect: false,
			callbackUrl: "/user",
		});
		/**
		 * instead of using signIn(..., redirect: "/user")
		 * we get the url from callback and push it to the router to avoid page refreshing
		 */
		push(url);
	};

	return (
		<div>
			<h3>Web3 Authentication</h3>
			<button onClick={() => handleMetamaskAuth()}>Authenticate via Metamask</button>
			<br />
			<br />
			<button onClick={() => handleWalletConnectAuth()}>Authenticate via WalletConnect</button>
			<br />
			<br />
			<button onClick={() => handleCoinbaseAuth()}>Authenticate via Coinbase Wallet</button>
		</div>
	);
}

export default SignIn;
