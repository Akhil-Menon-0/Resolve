import React from "react"

const ProductContext = React.createContext();  ///no packages needed,its inbuilt in react

class ProductProvider extends React.Component {
    constructor() {
        super();
        this.state = {
            user: null,
            modalopen: false,
            isLogged: false,
            socket: null,
            notification: [],
            messages: []
        }
        this.savesocket = this.savesocket.bind(this)
        this.deletesocket = this.deletesocket.bind(this)
        this.modalclose = this.modalclose.bind(this);
        this.modalopen = this.modalopen.bind(this);
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.appenddoubt = this.appenddoubt.bind(this)
        this.appendbookmark = this.appendbookmark.bind(this)
        this.addnotification = this.addnotification.bind(this)
        this.removenotification = this.removenotification.bind(this)
        this.addmessage = this.addmessage.bind(this)
    }

    addmessage(msg) {
        let temp = this.state.messages
        temp.push(msg);
        this.setState({ messages: temp })
    }

    addnotification(data) {
        let temp = this.state.notification;
        temp.push(data);
        temp.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date)
        })
        this.setState({ notification: temp })
    }

    removenotification(id) {
        let temp = this.state.notification.filter((item) => {
            if (item._id == id) { return false; }
            else { return true; }
        })
        this.setState({ notification: temp })
    }

    savesocket(socket) {
        this.setState({ socket: socket })
    }

    deletesocket() {
        this.setState({ socket: null })
    }

    appenddoubt(user_doubts) {
        let temp_user = this.state.user;
        temp_user.doubts = user_doubts
        this.setState({ user: temp_user })
    }

    appendbookmark(user_bookmark) {
        let temp_user = this.state.user;
        temp_user.bookmarks = user_bookmark
        this.setState({ user: temp_user })
    }

    modalopen() {
        this.setState({ modalopen: true });
    }

    login(newuser) {
        this.setState({
            user: newuser,
            isLogged: true
        })
    }

    logout() {
        this.setState({
            user: null,
            isLogged: false
        })
    }

    modalclose() {
        this.setState({ modalopen: false });
    }

    render(props) {
        return (
            <ProductContext.Provider value={{ messages: this.state.messages, notification: this.state.notification, addnotification: this.addnotification, addmessage: this.addmessage, removenotification: this.removenotification, savesocket: this.savesocket, deletesocket: this.deletesocket, appendbookmark: this.appendbookmark, appenddoubt: this.appenddoubt, socket: this.state.socket, isLogged: this.state.isLogged, user: this.state.user, modalopen: this.modalopen, modalclose: this.modalclose, modalstatus: this.state.modalopen, login: this.login, logout: this.logout }}>
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}
const ProductConsumer = ProductContext.Consumer;

export { ProductConsumer, ProductProvider };