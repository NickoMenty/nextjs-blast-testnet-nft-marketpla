import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 header">
            <img className="header_logo" src="/img/Logo.png"></img>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6 header_link">store</a>
                </Link>
                <Link href="/sell-nft">
                    <a className="mr-4 p-6 header_link">sell</a>
                </Link>
                <Link href="/mint-nft">
                    <a className="mr-4 p-6 header_link">mint</a>
                </Link>
                
            </div>
            <ConnectButton moralisAuth={false} />
        </nav>
    )
}
