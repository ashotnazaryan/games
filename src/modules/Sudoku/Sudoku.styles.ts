
import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
`;

export const Complexity = styled.div`
  padding: 10px 0;
`;

export const Board = styled.div.attrs(props => ({
  size: props.id
}))`
  width: ${props => Number(props.size) * 50}px;
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(${props => Number(props.size)}, 50px);
  grid-template-rows: repeat(${props => Number(props.size)}, 50px);
  grid-auto-flow: row;
  border: solid #666;
  border-width: 2px 0px 0px 2px;

  .cell {
    border: none;
    border-color: none;
    border-image: none;
    border-style: none;
    box-shadow: 0px 0px 3px #aaa;
    font-size: 35px;
    padding: 14px;
    box-sizing: border-box;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[type=number] {
      -moz-appearance: textfield;
    }

    &:focus-visible {
      outline: none;
    }

    &:disabled {
      border: none;
    }
  }
`;