
import React from "react";
import Link from "next/link";
import Row  from "react-bootstrap/Row";
import Col  from "react-bootstrap/Col";
import styledComponents from "styled-components";
import styled from "styled-components";
 
const StyledFooter = styledComponents.div`
    width: 100%;
    padding-left: 12px;
    padding-right: 12px;
   
`

const StyledCopyright = styledComponents.span`
    text-align: center;
    padding: 6px;
    display: block;
    padding-bottom: 5rem;
`

const StyledMenuHeader = styledComponents.div`
    font-weight: 700;
    width: 100%;
    padding-top: 20px;
    line-height: 40px;
    position: relative;
    cursor: default;
`
const LinkFooter = styledComponents('footer')`
.rated {
    display: block;
    border: 1px solid red;
    width: 64px;
    padding: 6px;
    text-align: center;
    background: red;
    font-weight: bold;
    color: #fff;
}
span {
    display: block;
    padding-top: 6px;
    padding-bottom: 6px;
}
 .icon {
     margin-left: 5px;
 }
 .icon-parent {
     cursor: pointer;
     transition: .3s;
 }
 .link  {
    padding-top: 6px;
    padding-bottom: 6px;
}
 .text-link-light-mode a {
    text-decoration: none;
    transition: .3s;
    color: #000;
 }
 .text-link-dark-mode a {
    text-decoration: none;
    transition: .3s;
    color: #fff;
 }
`

const helpLinks = [
    {
        name: 'Deposits',
        path: '/deposits'
    },
    {
        name: 'Withdrawals',
        path: '/withdrawals'
    },
    {
        name: 'Contact Us',
        path: '/contact'
    },
    {
        name: 'FAQ',
        path: '/FAQ'
    },
    {
        name: 'Terms and Conditions',
        path: '/terms-conditions'
    },
    {
        name: 'Responsible Gambling',
        path: '/responsible-gambling'
    },
    {
        name: 'Technical Issues',
        path: '/issues'
    },
    {
        name: 'Privacy Policy',
        path: '/privacy'
    },
    {
        name: 'Cookies Policy',
        path: '/cookies'
    },
    {
        name: 'Complaints Procedure',
        path: '/complaints'
    },
    {
        name: 'Rules',
        path: '/rules'
    }
]

const scoreLinks = [
    {
        name: 'Live Scores',
        path: '/live'
    },
    {
        name: 'Results',
        path: '/results'
    }
]

const promotionLinks = [
    {
        name: 'Open Account Offer',
        path: '#'
    },
    {
        name: 'Current Offers',
        path: '#'
    }
]

const socialLinks = [
    {
        name: 'Facebook',
        path: '/www.facebook.com/pageurl',
    },
    {
        name: 'Twitter',
        path: '/www.twitter.com/pageurl',
    },
    {
        name: 'Instagram',
        path: '/www.instagram.com/pageurl',
    }, 
    {
        name: 'WhatsApp',
        path: '/www.whatsapp.com/pageurl',
    }
]
export default function Footer({ displayMode }){

    const HelpLinkItem = (link, i) => (
        <div key={i} className={`link ${displayMode === 'light-mode' ? 'text-link-light-mode' : 'text-link-dark-mode'}`}>   
             <Link key={i} href={link.path} prefetch={false} >
                <a
                    itemProp="url"                    
                >                  
                     {link.name}
                </a>              
            </Link>
        </div>
    )

    const ScoreLinkItem = (link, i) => (
        <div key={i} className={`link ${displayMode === 'light-mode' ? 'text-link-light-mode' : 'text-link-dark-mode'}`}>
            <Link key={i} href={link.path} prefetch={false}> 
                <a
                    itemProp="url"
                >
                    {link.name}
                </a>
            </Link>
        </div>
    )

    const PromotionLinkItem = (link, i) => (
        <div key={i} className={`link ${displayMode === 'light-mode' ? 'text-link-light-mode' : 'text-link-dark-mode'}`}>
            <Link key={i} href={link.path} prefetch={false}>
                <a
                    itemProp="url"
                >
                    {link.name}
                </a>
            </Link>
        </div>
    )

    const SocialLinkItem = (link, i) => (
        <div key={i} className={`link ${displayMode === 'light-mode' ? 'text-link-light-mode' : 'text-link-dark-mode'}`}>
            <Link key={i} href={link.path} prefetch={false}>
                <a 
                    itemProp="url"
                >
                    {link.name}
             
                </a>
            </Link>
        </div>
    )

    return (
        <>
            <StyledFooter>
            <div className="p-2 container">
                <div className="d-flex">
                    <div className={`w-100 ${displayMode === 'dark-mode' ? 'text-white' : 'text-dark'}`}>
                        <StyledMenuHeader>
                            Help
                        </StyledMenuHeader>
                        <LinkFooter>
                            {helpLinks.map(HelpLinkItem)}
                        </LinkFooter>
                        <StyledMenuHeader>
                            Social
                        </StyledMenuHeader>
                        <LinkFooter>
                            {socialLinks.map(SocialLinkItem)}
                        </LinkFooter>
                    </div>
                    <div className={`w-100 ${displayMode === 'dark-mode' ? 'text-white' : 'text-dark'}`}>
                        <StyledMenuHeader>
                            Settings
                        </StyledMenuHeader>
                        <LinkFooter>
                            <span className="icon-parent">
                                Language
                                <i className="bi bi-chevron-down icon"></i>
                            </span>
                            <span className="icon-parent">
                                Odds Display
                                <i className="bi bi-chevron-down icon"></i>
                            </span>
                        </LinkFooter>
                        <StyledMenuHeader>
                            Scores & Results
                        </StyledMenuHeader>
                        <LinkFooter>
                            {scoreLinks.map(ScoreLinkItem)}
                        </LinkFooter>
                        <StyledMenuHeader>
                            Legal & Compliance
                        </StyledMenuHeader>
                        <LinkFooter>
                            <span className="rated rounded">18+</span>
                            <span>
                                This forum is open only to persons over the age of 18 years. 
                                Gambling may have adverse effects if not taken in moderation.
                            </span>
                        </LinkFooter>              
                        
                        <StyledMenuHeader>
                            Promotions
                        </StyledMenuHeader>
                        <LinkFooter>
                            {promotionLinks.map(PromotionLinkItem)}
                        </LinkFooter>                 
                    </div>
                </div>
            </div>  
        </StyledFooter> 
        <StyledCopyright className="bg-dark text-white shadow-sm">      
           <span>Copyright &copy; 2022 - All Rights Reserved &reg; Cynkem Sports</span>
           <span className="d-block">Version: 1</span>
        </StyledCopyright>
        </>
    
    )
}