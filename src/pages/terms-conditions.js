import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import styled from "styled-components";

const StyledTerms = styled.div`
 height: 100vh;
 background: #fff;
`

export default function TermsConditions() {
    return (
        <StyledTerms>
            <Container className="pt-3">
                <Card >
                    <Card.Header>
                        <h4>GENERAL TERMS & CONDITIONS</h4>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-between">
                            <h6>1. INTRODUCTION</h6>
                            <span>+</span>
                        </div>
                        <div>
                            {INTRODUCTION}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </StyledTerms>
    )
}

const INTRODUCTION = `
1.1. In these Terms and Conditions, save as otherwise provided or the context otherwise requires "SportPesa" means the Operator of the SportPesa brand in Kenya under a local company with registration number PVT-9XUGA85 whose address for purposes hereof is at The Chancery, Valley Road, Nairobi ("Company"), its successors in title and assigns and, where the context so requires, its agents, service providers, data processors, business partners including any entity that may provide technical support and ancillary services to the Company enable it to operate gaming and ancillary services or products. 

1.2. This agreement establishes the Terms and Conditions that will govern the contractual relationship between SportPesa and you as a Registering/Participating Player with SportPesa. The Terms shall apply to account opening and gaming via all media/electronic platforms including but not limited to mobile devices, computers and laptops. You are required to accept these Terms and Conditions when registering for an account with SportPesa and you are bound by these Terms and Conditions throughout the existence of the relationship. SportPesa reserves the right to decline your registration/ participation without being bound to provide any reasons whatsoever at any time.

1.3. If you are an existing customer of SportPesa, by accepting these Terms and Conditions, you hereby unconditionally and unequivocally authorise any data processor of SportPesa or any third party (who previously held your personal data in its capacity as a data controller or in any other lawfully capacity) to share with the Company on your behalf your personal data held by such data processor, any third party or other source and further hereby give consent to SportPesa to collect your personal data from such data processor, any third party or any other source whatsoever. Upon transfer of your personal data by, or collection from, any data processor, third party or any other source, the Company shall, with effect from the date of your acceptance of these Terms and Conditions become a data controller over your personal data received by it from such data processor, any third party or other source and shall be permitted to use and process your personal data in accordance with these Terms and Conditions and our Privacy Policy and thereupon your existing SportPesa customer account will be transferred and activated by the Company.

1.4. These Terms and Conditions are categorized for ease of reference and understanding. It is important that you make yourself aware of these Terms and Conditions as a participating player. Reference to "you", "your", the "player", "customers", or "subscriber" is reference to any person using the gaming/betting platform or the services and/ or any registered customer of SportPesa. Reference to "SportPesa", "the Company", "us", "our" "we" is reference to "SportPesa" and or its successors in title and assigns and, where the context so requires, its agents, service providers, data processors, business partners including any entity that the Company may provide technical services to enable it to operate gaming and ancillary services or products.

1.5. SportPesa reserves the right to change these Terms and Conditions at any time and without prior notice. SportPesa will endeavour to inform you about major modifications to the Terms and Conditions. Nevertheless, it is your responsibility to regularly check for any changes. Should you, due to any possible changes, not wish to continue using the services of SportPesa, or any data processor, you can withdraw uncommitted funds without penalty and close the account by sending an email to: care@ke.sportpesa.com, to that effect. A response will be sent to you within 48 hours confirming receipt of your decision to discontinue your engagement with the Company. Failure by you to receive a message for any reason whatsoever shall not be taken to mean that the Company has any continued obligation towards you from the date of your withdrawal.

1.6. The Company will respect your privacy in line with the Company's privacy policy ("Privacy Policy https://www.ke.sportpesa.com/privacy_policy") which form an integral part of these Terms and Conditions and will endeavour to at all times preserve your information in the strictest confidence as it possibly can. 
1.7. The Company will not disclose your personal information to third parties unless such disclosure:

(a) is required for the performance of this contract or for the processing of your requests including any request under paragraph 2;
(b) is a duty and/or legal obligation of the Company or any data processor acting for the Company;
(c) is required to enforce/ apply the Terms and Conditions and other related agreements;
(d) is necessary in order to protect the vital interests of the data subject or another natural person;
(e) is necessary for the performance of any task carried out by a public authority;
(f) is necessary for the exercise, by any person in the public interest, of any other functions of a public nature;
(g) is required to adequately protect our rights or property, including via the exchange of information with other companies and organizations for the purposes of information verification, fraud protection and credit risk reduction. Personal information that you provide may be disclosed to a credit reference agency, which may keep a record of the information; 
(h) is in accordance and in compliance with the Privacy Policy; or 
(i) for any other purpose duly authorised, permitted or envisaged under the Data Protection Act, 2019 of Kenya, Act No. 24 of 2019.

1.8. The contractual relationship between you and the Company is governed by these Terms and Conditions and by the relevant and applicable Laws of Kenya, Kenya being the operational jurisdiction of the Company and its service/products where they will be offered directly to all its duly registered players and /or through its service providers and intermediaries.

1.9. By agreeing to these Terms and Conditions and where you play any game, or place a bet or stake, using the provided betting platforms, you accept and agree to be bound by these Terms and Conditions and any amendment or variation thereto and the rules which apply to the applicable products available from time to time. You are acknowledging that the Company shall retain the right to use from time to time, all data collected to carry out market survey/ campaign /research, send customer satisfaction questionnaires, market and promote its services and those of its affiliated companies.

1.10. The Company is not responsible for any consequences resulting from major incidents such as any strike, terrorist activities, political crisis, war, natural catastrophe and saturation of the telecommunication networks, cyber-attacks, hacking etc., which could lead to a total or partial access reduction to its services, loss of data by itself or by other contracted independent service providers on whom the Company will wholly or partially be reliant on to deliver the services.
`