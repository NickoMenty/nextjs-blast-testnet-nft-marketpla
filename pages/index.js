import styles from "../styles/Home.module.css"
import { useMoralis } from "react-moralis"
import { useState } from 'react';
import NFTBox from "../components/NFTBox"
import Link from "next/link"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

export default function Home() {
    const { chainId, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : null
    const marketplaceAddress = chainId ? networkMapping[chainString].NftMarketplace[0] : null

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    const faqData = [
        { question: 'Питання 1?', answer: 'Відповідь на питання 1.' },
        { question: 'Питання 2?', answer: 'Відповідь на питання 2.' },
        // Додайте більше питань та відповідей якщо потрібно
      ];
    
      const [openIndex, setOpenIndex] = useState(null);
    
      const toggleFAQ = (index) => {
        if (openIndex === index) {
          setOpenIndex(null);
        } else {
          setOpenIndex(index);
        }
      };

      const faqs = [
        {
          question: 'what is our mission?',
          answer: 'In Avantart we define our mission as sharing love and interest to digital art',
        },
        {
          question: 'what abot token?',
          answer: 'According to our roadmap the Avantart token will be launched in q2-q3 2024',
        },
        {
            question: 'what is the value of avantart NFT?',
            answer: 'The artistic value of the NFT, including the creativity, skill, and uniqueness of the digital artwork, plays a crucial role. Exceptional and rare pieces may hold higher value.',
        },
        {
            question: 'how many nft can i mint?',
            answer: 'You can mint as many NFT as you want, in case you have enough money of course!',
        },
        // Add more FAQs as needed
      ];
      
      const [activeIndex, setActiveIndex] = useState(null);

      const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
      };

    return (
        <div className="container mx-auto main">

            <div className="welcome">
                <div className="welcome_info">
                    <h1 className="welcome_logo">avantart</h1>
                    <h2 className="welcome_slogan">//the nft marketplace</h2>
                    <div className="welcome_txt">Your premier hub for unique NFT creations! 
                        In our marketplace, you'll discover an infinite world of digital art, 
                        where each token tells its own story and possesses its own distinct character.
                    </div>
                    <button className="get_started button">get started</button>
                </div>
                <img className="welcome_img" src="/img/mainnft.png"></img>
            </div>

            <div className="more">
                <div className="read">
                    read more
                    <img className="underline read_underline" src="/img/underline.png"></img>
                </div>
                <Link href="/" className="read_link"><button className="read_btn button">roadmap</button></Link>
                <Link href="/" className="read_link"><button className="read_btn button">whitepaper</button></Link>
            </div>

            <div className="scrolling-text">
                <h1 className="scrolling-content">RECENTLY LISTED</h1>
                <h1 className="scrolling-content">RECENTLY LISTED</h1>
                <h1 className="scrolling-content">RECENTLY LISTED</h1>
                <h1 className="scrolling-content">RECENTLY LISTED</h1>
                <h1 className="scrolling-content">RECENTLY LISTED</h1>
                <h1 className="scrolling-content">RECENTLY LISTED</h1>
                <h1 className="scrolling-content">RECENTLY LISTED</h1>
                <h1 className="scrolling-content">RECENTLY LISTED</h1>
            </div>
            
            <div className="flex flex-wrap nft">
                {isWeb3Enabled && chainId ? (
                    loading || !listedNfts ? (
                        <div className="loading">Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return marketplaceAddress ? (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            ) : (
                                <div className="error">Network error, please switch to a supported network. </div>
                            )
                        })
                    )
                ) : (
                    <div className="error">Web3 Currently Not Enabled</div>
                )}
            </div>

            <div className="faq">
            faq
            <div className="faq-container">
                {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                    <div className={`faq-question ${activeIndex === index ? 'active' : ''}`} onClick={() => toggleAccordion(index)}>
                    {faq.question}
                    </div>
                    {activeIndex === index && <div className="faq-answer">{faq.answer}</div>}
                </div>
                ))}
            </div>
          </div>          
        </div>
    )
}