import React from 'react';
import ReactDOM from 'react-dom';
import Standings from './Standings';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Standings />, div);
  ReactDOM.unmountComponentAtNode(div);
});
