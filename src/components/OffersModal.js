import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Modal } from "react-bootstrap";
import { faGifts } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function OffersModal({ isModalOpen,closeMenu }) {
    return (
        <Modal show={isModalOpen} centered>
            <Modal.Header className="d-flex flex-column justify-content-center bg-info">
                <div className="bg-primary rounded-circle p-4 shadow">
                    <FontAwesomeIcon icon={faGifts} size="3x" className="text-white" />
                </div>       
                <div className="text-center mt-4">
                    <h3 className="fw-bold">Get our latest offers and promotions</h3>
                </div>         
            </Modal.Header>
            <Modal.Body className="bg-light">            
                <div className="d-flex align-items-center justify-content-start">
                    <h1 className="text-white fw-bold p-3 bg-danger rounded-pill shadow">100%</h1>
                    <h6 className="m-3 ">
                        Receive 100% Cash Bonus on every Deposit of Kes 500/= and above.
                    </h6>
                </div>
                <div className="d-flex align-items-center justify-content-start mt-3">
                    <h1 className="text-white fw-bold p-3 bg-danger rounded-pill shadow">FREE</h1>
                    <h6 className="m-3">
                       Withdrawals on Won Betslips, Place Bet NOW!
                    </h6>
                </div>
            </Modal.Body>
            <Modal.Footer className="bg-primary">
                <button className="btn btn-danger shadow" onClick={closeMenu}> 
                    Cancel
                </button>
                <Link href="/profile">
                    <a 
                    itemProp="url"
                    className="btn btn-light shadow"
                    > 
                        Deposit
                    </a>
                </Link>
              
            </Modal.Footer>
        </Modal>
    )
}