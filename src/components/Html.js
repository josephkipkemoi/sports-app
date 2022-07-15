import React from "react";
import styled, { css } from "styled-components";
import tw from "twin.macro";
const margin = css`
    margin: 0 auto 1rem;
`

// export const H1 = styled('h1')`
//  ${margin};
//  font-size: ${props => props.theme.sizes.h1}rem;
//  line-height: ${props => props.theme.sizes.h1 * 1.2}rem;
// `
 

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

export const InputNumber = styled(({ children, ...res }) => (
    <input type="number" {...res}/>
))`
::-webkit-outer-spin-button,
::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
`
export const H1 = styled('h1')`
line-height: 30px;
`
export const H2 = styled('h1')`
line-height: 30px;
`
export const H3 = styled('h1')`
line-height: 30px;
`
export const H4 = styled('h1')`
line-height: 30px;
`
export const H5 = styled('h1')`
${margin};
font-size: ${props => props.theme.sizes.h5}rem;
line-height: ${props => props.theme.sizes.h5 * 1.2}rem;
`
export const H6 = styled('h1')`
line-height: 30px;
`

export const Span = styled('span')`
line-height: 24px;
`

export const Small = styled('small')`
line-height: 30px;
color: #ffffff;
font-weight: 600;
letter-spacing: 1px;
`