import * as React from "react";
import { Store, Value, Listener } from "manatea";

interface Props {
  store: Store;
  children: (value: Value) => React.ReactNode;
}

interface State {
  value: Value;
}

class Manatea extends React.Component<Props, State> {
  state: State = { value: this.props.store() };
  listener: Listener = this.props.store.on((value: Value) => this.setState({ value }));

  componentWillUnmount() {
    if (this.listener.listening) {
      this.listener();
    }
  }

  render() {
    return this.props.children(this.state.value);
  }
}

export default Manatea;
