import EventEmitter from "eventemitter3"
interface eventList {
	[key: string]: any
}
export default new EventEmitter<eventList>()
