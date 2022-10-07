import { faHeadset, faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import  Card  from "react-bootstrap/Card";
import  Container  from "react-bootstrap/Container";
import styled from "styled-components";
import { useGetAdminMessagesQuery } from "../hooks/messages";
import MobileNavComponent from '../components/MobileNavComponent';
import { SendSvgIcon } from "../components/Svg";
import { useRouter } from "next/router";

const StyleMessages = styled.div`
 height: 100vh;
 background: #fff;

`
export default function Messages() {
    const router = useRouter()

    useEffect(() => {
         router.push('/contact')
    }, [])

    return (
        <StyleMessages>
       
        </StyleMessages>
    )
}



