//@flow
import React from 'react';
import { MonoFont } from 'src/theme';
import { observer } from 'mobx-react';
import player from 'src/logic/player';
import styled from 'styled-components';

const TextualFont = styled(MonoFont)`
  font-size: 0.75em;
`;


export default @observer class StatsBoard extends React.PureComponent<{}> {
  render() {
    return (
      <TextualFont>
        <div>
          Health {player.currentHealth}/{player.health}
        </div>
        <div>
          Speed {player.currentSpeed}/{player.speed}
        </div>
        <div>
          <u>Actions</u>
          {
            player.actions.map((a, i) => 
              <p>
              <span>{i + 1}. {a.title}</span>
              <br />
              <i>{a.description}</i>
              </p>
            )
          }
        </div>
      </TextualFont>
    );
  }
}
