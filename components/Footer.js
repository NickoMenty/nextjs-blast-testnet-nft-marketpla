import Link from "next/link"
import { FaMediumM } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";

export default function Footer() {
    return (
        <nav className="p-5 footer">
            <img className="footer_logo" src="/img/footer_logo.png"></img>
            <div className="flex flex-row items-center">
                <Link className="footer_link" href="/">
                    <FaMediumM />
                </Link>
                <Link className="footer_link" href="/">
                    <FaXTwitter />
                </Link>
                <Link className="footer_link" href="/">
                    <FaDiscord />
                </Link>
                
            </div>
        </nav>
    )
}
