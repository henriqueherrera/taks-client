import React, { Component } from 'react';
import {
	View,
	Text,
	ImageBackground,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Platform,
	Alert
} from 'react-native';
import { AsyncStorage } from 'react-native';
import todayImage from '../../assets/imgs/code.png';
import moment from 'moment';
import 'moment/locale/pt-br';
import commonStyles from '../commonStyles';
import Task from '../components/Task';
import AddTask from '../components/AddTask';
import Icon from 'react-native-vector-icons/FontAwesome';

const initialState = {
	showDoneTasks: true,
	showAddTasks: false,
	visibleTasks: [],
	tasks: []
}

export default class TaskList extends Component {
	state = {
		...initialState
	};

	toggleTask = taskId => {
		const tasks = [...this.state.tasks];

		tasks.forEach(task => {
			if (task.id == taskId) task.doneAt = task.doneAt ? null : new Date();
		});
		this.setState({ tasks }, this.filterTasks);
	};

	componentDidMount = async () => {
		const stateString = await AsyncStorage.getItem('tasksState');
		const state = JSON.parse(stateString) || initialState;

		this.setState(state, this.filterTasks);
	}

	toggleFilter = () => {
		this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks);
	}

	filterTasks = () => {
		let visibleTasks = null;

		if (this.state.showDoneTasks) {
			visibleTasks = [...this.state.tasks];
		} else {
			visibleTasks = this.state.tasks.filter(task => task.doneAt === null);
		}

		this.setState({ visibleTasks });
		AsyncStorage.setItem('tasksState', JSON.stringify(this.state));
	}

	AddTask = newTask => {
		if (!newTask.desc || !newTask.desc.trim()) {
			Alert.alert('Dados Inválidos', 'Decrição não informada!');
			return;
		}

		const tasks = [...this.state.tasks];
		tasks.push({
			id: Math.random(),
			desc: newTask.desc,
			estimateAt: newTask.date,
			doneAt: null
		});

		this.setState({ tasks, showAddTasks: false }, this.filterTasks);
	}

	deleteTask = id => {
		const tasks = this.state.tasks.filter(task => task.id !== id);
		this.setState({ tasks }, this.filterTasks);
	}

	render() {
		const today = moment().locale('pt-br').format('ddd, D [de] MMMM');
		return (
			<View style={styles.container}>
				<AddTask isVisible={this.state.showAddTasks}
					onCancel={() => this.setState({ showAddTasks: false })}
					onSave={this.AddTask}
				/>
				<ImageBackground source={todayImage} style={styles.background}>
					<View style={styles.titleBar}>
						<View style={styles.iconBar}>
							<TouchableOpacity onPress={this.toggleFilter}>
								<Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'} size={20} color={commonStyles.colors.secondary} />
							</TouchableOpacity>
						</View>
						<Text style={styles.title}>Hoje</Text>
						<Text style={styles.subtitle}>{today}</Text>
					</View>
				</ImageBackground>
				<View style={styles.taskList}>
					<FlatList
						data={this.state.visibleTasks}
						keyExtractor={item => `${item.id}`}
						renderItem={({ item }) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} />}
					/>
				</View>
				<TouchableOpacity style={styles.addButton}
					activeOpacity={0.7}
					onPress={() => this.setState({ showAddTasks: true })}
				>
					<Icon name='plus' size={20} color={commonStyles.colors.secondary} />
				</TouchableOpacity>
				<Text>developed by R.H</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	background: {
		flex: 3
	},
	taskList: {
		flex: 7
	},
	titleBar: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	title: {
		color: 'white',
		fontSize: 50,
		marginLeft: 20,
		marginBottom: 20
	},
	subtitle: {
		color: 'white',
		fontSize: 20,
		marginLeft: 20,
		marginBottom: 30
	},
	iconBar: {
		flexDirection: 'row',
		marginHorizontal: 20,
		justifyContent: 'flex-end',
		marginTop: Platform.OS === 'ios' ? 40 : 10
	},
	addButton: {
		position: 'absolute',
		right: 30,
		bottom: 30,
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: commonStyles.colors.today,
		justifyContent: 'center',
		alignItems: 'center'
	}
})