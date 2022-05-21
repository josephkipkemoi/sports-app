import React from "react";
import styled, { css } from "styled-components";

const margin = css`
    margin: 0 auto 1rem;
`

export const H1 = styled('h1')`
 ${margin};
 font-size: ${props => props.theme.sizes.h1}rem;
 line-height: ${props => props.theme.sizes.h1 * 1.2}rem;
`