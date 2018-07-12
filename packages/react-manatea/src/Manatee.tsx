import * as React from "react";
import { Cup, Tea, Listener } from "manatea";

import getCup from "./getCup";

interface Props {
  cup: Cup;
  children: (tea: Tea) => React.ReactNode;
}

interface State {
  tea: Tea;
}

export default class Manatee extends React.Component<Props, State> {
  state: State = { tea: getCup(this.props.cup)() };
  listener: Listener = getCup(this.props.cup).on((tea: Tea) => this.setState({ tea }));

  componentWillUnmount() {
    if (this.listener.listening) {
      this.listener();
    }
  }
  render() {
    return this.props.children(this.state.tea);
  }
}
