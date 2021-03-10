import PropTypes from 'prop-types';
import { OverlayTrigger } from 'react-bootstrap';

import AspectRatioKeeper from '../../../../../../AspectRatioKeeper';

import Tooltip from './Tooltip';

const Button = props => (
  <AspectRatioKeeper style={{ margin: '10px 0 10px 0' }}>
    <Tooltip
      {...props}
      style={{
        backgroundColor: 'blue',
        padding: 5,
        boxShadow: '0 0 2px 2px blue'
      }}
    >
      <div className="button" onClick={props.onClick}>
        {props.icon && <img src={props.icon} className="icon" />}
      </div>
    </Tooltip>
    <style jsx>
      {`
        .button {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #ffffff;
          box-shadow: 0 0 2px 2px #ffffff;
          border-radius: 5px;
          cursor: pointer;
          user-select: none;
          transition: 0.2s;
        }
        .button:hover {
          border-radius: 8px;
          box-shadow: 0 0 3px 3px #ffffff;
          transform: rotate(15deg);
        }
        .icon {
          position: absolute;
          transform: translate(-50%, -50%);
          left: 50%;
          top: 50%;
          width: 60%;
        }
      `}
    </style>
  </AspectRatioKeeper>
);

Button.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  onClick: PropTypes.func
};

Button.defaultProps = {
  icon: '',
  text: '',
  onClick: () => {}
};

export default Button;
