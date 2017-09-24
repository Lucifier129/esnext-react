if (typeof requestAnimationFrame === 'undefined') {
	window.requestAnimationFrame = fn => setTimeout(fn, 100 / 6)
	window.cancelAnimationFrame = id => clearTimeout(id)
}

if (typeof console === 'undefined') {
	console = { log() {}, time() {}, timeEnd() {} }
}

const Counter = React.createClass({
	getInitialState() {
		return {
			text: '123123123'
		}
	},
	componentWillMount() {
		console.time('Counter mount')
	},
	componentDidMount() {
		console.timeEnd('Counter mount')
	},
	toNum(num, callback) {
		cancelAnimationFrame(this.rid)
		let { COUNT } = this.props
		let counting = () => {
			let { count } = this.props
			switch (true) {
				case count > num:
					COUNT('DECREMENT')
					break
				case count < num:
					COUNT('INCREMENT')
					break
				case count === num:
					return callback && callback()
			}
			this.rid = requestAnimationFrame(counting)
		}
		counting()
	},
	componentWillUpdate() {
		// debugger
		console.log('willUpdate', 'Counter')
		if (this.state.text === '123123123') {
			this.setState({
				text: '[text set by willUpdate]'
			})
		}
		console.log(this.state.text, 'WillUpdate')
		
	},
	componentDidUpdate() {
		console.log(this.state.text, 'DidUpdate')
		this;
		//debugger
		console.log('DidUpdate', 'Counter')
	},
	componentWillReceiveProps(nextProps) {
		let state = this.state
		console.log('Counter: receiveProps:setState', state === this.state)
	},
	shouldComponentUpdate(nextProps, nextState) {
		console.log('Counter: shouldComponentUpdate')
		return true
	},
	componentWillUnmount() {
		console.log('unmount', 'Counter')
	},
	getNum(e) {
		let num = parseInt(this.input.value, 10)
		if (typeof num === 'number') {
			this.toNum(num)
		}
	},
	getInput(input) {
		this.input = input
	},
	handleChange(e) {
		let text = e.target.value.replace(/[^\d]+/, '')
		this.setState({ text })
	},
	render() {
		let { props } = this
		let { COUNT } = props
		var img = <img
					src="http://ww3.sinaimg.cn/bmiddle/887790fagw1ezs0ci6qjxj20c10go0uf.jpg"
					ref="img"
					onLoad={()=>{
			          console.log('onload this.refs', this.refs)
			        }}
			        onError={()=>{
			          console.log('onerror this.refs', this.refs)
			        }}
		 />
		return (
			<div id="abc">
			{ Math.random() > 0.5 && img }
				<span ref={Math.random() > 0.5 ? '' : 'test-ref'} data-test="abaasdf">count: { props.count }</span>
				{' '}
				<button onClick={ () => COUNT('INCREMENT') }>+</button>
				{' '}
				<button onClick={ () => COUNT('DECREMENT') }>-</button>
				{' '}
				<button onClick={ () => COUNT('INCREMENT_IF_ODD') }>incrementIfOdd</button>
				{' '}
				<label htmlFor="myinput">input number:
					<input 
						type="text" 
						value={this.state.text}
						onChange={this.handleChange}
						onFocus={event => {
							COUNT('INCREMENT')
						}}
						ref={ this.getInput } 
						id="myinput" 
						name="myinput" />
				</label>
				<button onClick={ this.getNum }>run</button>
				<a href="adbadfasdf">test link</a>
				<p dangerouslySetInnerHTML={{ __html: 'test dangerouslySetInnerHTML: ' + Math.random().toString(36).substr(2)}}></p>
			</div>
		)
	}
})

var Example = React.createClass({
  getInitialState() {
    return {
      val: 0,
      test: 0
    };
  },

  componentDidMount() {
    this.setState({val: this.state.val + 1, test1: 1})
    console.log('didMount', this.state);    // log 1
    this.setState({val: this.state.val + 1, test2: 2});
    console.log('didMount', this.state);    // log 2

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log('setTimeout:', this.state);  // log 3
      this.setState({val: this.state.val + 1});
      console.log('setTimeout:', this.state);  // log 4
    }, 4);
  },

  render() {
    return <p ref="paragraph">{this.state.val}</p>;
  }
});

const Wrap = React.createClass({
	getInitialState() {
		return { count: 0 }
	},
	COUNT(type) {
		let { count } = this.state
		switch(type) {
			case 'INCREMENT':
			count += 1
			break
			case 'DECREMENT':
			count -= 1
			break
			case 'INCREMENT_IF_ODD':
			if (count % 2 === 0) {
				return
			}
			count += 1
			break
		}
		this.setState({ count })

	},
	componentWillMount() {
		console.time('Wrap mount')
		// let state = this.state
		// this.setState({
		// 	count: this.props.count
		// })
		// console.log('componentWillMount:setState', state === this.state)
	},
	componentDidMount() {
		console.timeEnd('Wrap mount')
		let state = this.state
		this.setState({
			count: this.props.count * 2
		})
		console.log('componentDidMount:setState', state === this.state)
		console.log(this)
	},
	componentWillUpdate() {
		// debugger
		console.log('willUpdate', 'Wrap')
	},
	componentDidUpdate() {
		//debugger
		console.log('DidUpdate', 'Wrap')
	},
	componentWillReceiveProps(props) {
		this.setState({
			count: props.count
		})
		console.log('Wrap:receiveProps')
	},
	shouldComponentUpdate() {
		console.log('Wrap: shouldComponentUpdate')
		return true
	},
	componentWillUnmount() {
		console.log('unmount', 'wrap')
	},
	render() {
		let example = <Example ref="example" />
		// let count = Math.random() > 0.5
		// ? <Counter ref="counter" count={ this.state.count } COUNT={ this.COUNT } />
		// : null
		return <div>
				<Counter ref="counter" count={ this.state.count } COUNT={ this.COUNT } />
				{example}
				{example}
			</div>
	}
})

class SelectOptions extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {selectedValue: [2, 4]};
	}

	update() {
		this.setState( {
			selectedValue: [1,2,3,4]
		})
	}

	onChange(e) {
		this.setState( {
			selectedValue: e.target.value
		})		
	}

	render() {
		return <div>
			<h1 onClick={this.update.bind(this)}>select Node 5 {this.state.selectedValue}</h1>
			<select 
				onChange={this.onChange.bind(this)} 
				value={this.state.selectedValue} ref="selectNode" id="selectNode" multiple>
				<option value={1}>Bob</option>
				<option value={2}>Andrew</option>
				<option value={3}>Carl</option>
				<option value={4}>Collin</option>
			</select>
			</div>;
	}
}

var wrap = <Wrap count={ 10 } />

let update = count => {
	return React.render(
		<SelectOptions />,
		document.getElementById('container')
	)
}

let num = 10
update()

// const context = {
//     THIS_IS_IMPORTANT: function() {}
// }

// class ContextProvider extends React.Component {
//     static childContextTypes = context;

//     getChildContext() {
//         return this.props.context
//     }

//     render() {
//         return this.props.children
//     }
// }

// class Test extends React.Component {

//     static contextTypes = context;

//     // We added THIS constructor
//     constructor(props) {
//         super(props)
//     }

//     render() {
//         console.info('This should NOT be undefined:', this.context.THIS_IS_IMPORTANT)
//         return <div>Test1</div>
//     }
// }

// // Render HTML on the browser
// React.render(<ContextProvider context={context}><Test/></ContextProvider>, document.body)



// class TestRootUpdateAtDidMount extends React.Component {
// 	componentDidMount() {
// 		console.log('TestRootUpdateAtDidMount didMount')
// 		updateName('TestRootUpdateAtDidMount1', () => console.log('TestRootUpdateAtDidMount1 done'))
// 		updateName('TestRootUpdateAtDidMount2', () => console.log('TestRootUpdateAtDidMount2 done'))
// 		updateName('TestRootUpdateAtDidMount3', () => console.log('TestRootUpdateAtDidMount3 done'))
// 	}
// 	render() {
// 		let { props } = this
// 		console.log('render count', props.name)
// 		return <div>{props.name} asdfsdf</div>
// 	}
// }

// class TestRootUpdateAtDidMountWrapper extends React.Component {
// 	state = {
// 		text: 'TestRootUpdateAtDidMountWrapper text'
// 	};
// 	componentDidMount() {
// 		console.log('TestRootUpdateAtDidMountWrapper didMount')
// 		this.setState({
// 			text: 'change at didMount'
// 		})
// 		this.setState({
// 			text: 'change at didMount1'
// 		})
// 		updateName('TestRootUpdateAtDidMountWrapper')
// 	}
// 	render() {
// 		let { props } = this
// 		let children = testCount++ > 0 ? <TestRootUpdateAtDidMount name={props.name} /> : 'init'
// 		return (<div>
// 					{this.state.text + ' ' + (this.props.name || 'default name')}
// 					{children}
// 				</div>)
// 	}
// }

// let testCount = 0


// let Root = props => {
	
// 	return <div className="root"><p>placeholder</p><TestRootUpdateAtDidMountWrapper {...props} /></div>
// }

// var globalState = {
// 	name: 'init'
// }

// var updateName = (name, callback) => {
// 	console.log('updateName', name)
// 	globalState = {
// 		...globalState,
// 		name
// 	}
// 	renderTest(callback)
// }

// let renderTest = (callback) => {
// 	React.render(
// 		<Root {...globalState} />,
// 		document.getElementById('container'),
// 		callback
// 	)
// }

// updateName('init')
// updateName('update')





// class Test extends React.Component {
// 	componentWillMount() {
// 		console.log(this.props.index, 'willMount')
// 		debugger
// 	}
// 	componentDidMount() {
// 		console.log(this.props.index, 'didMount')
// 		debugger
// 	}
// 	componentWillUnmount() {
// 		console.log(this.props.index, 'willUnmount')
// 	}
// 	render() {
// 		return <div>{this.props.index}</div>
// 	}
// }

// var root = (
// 	<div>
// 		<Test index={0} />
// 		<Test index={1} />
// 		<Test index={2} />
// 	</div>)

// React.render(root, document.getElementById('container'))





