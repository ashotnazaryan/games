
import styled from 'styled-components';

export const Container = styled.div`
  padding: 10px;
`;

export const Difficulty = styled.div`
  padding: 10px 0;
`;

export const Board = styled.div.attrs(props => ({
  size: props.id,
}))`
  display: grid;
  grid-gap: 0;
  grid-template-columns: repeat(${props => Number(props.size) / 3}, 150px);
  grid-template-rows: repeat(${props => Number(props.size) / 3}, 150px);
  grid-auto-flow: row;

  .sub-board {
    display: grid;
    grid-gap: 0;
    grid-template-columns: repeat(${props => Number(props.size) / 3}, 50px);
    grid-template-rows: repeat(${props => Number(props.size) / 3}, 50px);
    grid-auto-flow: row;
    box-shadow: 0 0 3px #666;
  }

  .cell {
    border-style: none;
    box-shadow: 0px 0px 3px #aaa;
    font-size: 35px;
    padding: 14px;
    box-sizing: border-box;

    &:focus-visible {
      outline: none;
    }
  }
`;