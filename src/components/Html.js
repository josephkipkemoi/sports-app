import React from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
const margin = css`
    margin: 0 auto 1rem;
`

export const H1 = styled('h1')`
 ${margin};
 font-size: ${props => props.theme.sizes.h1}rem;
 line-height: ${props => props.theme.sizes.h1 * 1.2}rem;
`

export const H5 = styled('h5')`
${margin};
font-size: ${props => props.theme.sizes.h5}rem;
line-height: ${props => props.theme.sizes.h5 * 1.2}rem;
`

export const Img = styled(({ children, ...res}) => (
    <Image wudth="500" height="400" {...res} />
))`
    ${tw`max-w-full w-auto h-auto`}
`

export const Input = styled(({ children, ...res }) => (
    <input  {...res}/>
))`
    min-width: 84px;
    max-width: 200px;
`