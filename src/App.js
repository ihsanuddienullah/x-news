import "./styles/css/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import {
    Login,
    DashboardReporter,
    NewsDetail,
    MyNews,
    CreateNews,
    EditNews,
    MyDraft,
    DashboardPublisher,
    Trending,
    UserList,
    CreateUser,
    EditUser,
    Proposal,
    UnapprovedNews,
} from "./pages";
import HeaderSidebar from "./components/items/header/HeaderSidebar.component";
import { ApolloProvider } from "@apollo/client";
import client from "./config/graphql";
import { useState, useEffect } from "react";

const App = () => {
    const roles = localStorage.getItem("roles");
    const [isLoginAuthor, setIsLoginAuthor] = useState(false);
    const [isLoginPublisher, setIsLoginPublisher] = useState(false);

    useEffect(() => {
        if (roles === "author") {
            setIsLoginAuthor(true);
        } else if (roles === "publisher") {
            setIsLoginPublisher(true);
        } else {
            setIsLoginPublisher(false);
            setIsLoginAuthor(false);
        }
    }, [roles]);

    return (
        <BrowserRouter>
            <ApolloProvider client={client}>
                <div className="App">
                    <HeaderSidebar />
                    <Switch>
                        <Route component={Login} path="/" exact />
                        {/* reporter */}
                        <Route
                            component={
                                isLoginAuthor ? DashboardReporter : Login
                            }
                            path="/dashboardreporter"
                            exact
                        />
                        <Route
                            component={isLoginAuthor ? NewsDetail : Login}
                            path="/newsdetail/:id"
                            exact
                        />
                        <Route
                            component={isLoginAuthor ? MyNews : Login}
                            path="/mynews"
                            exact
                        />
                        <Route
                            component={isLoginAuthor ? CreateNews : Login}
                            path="/createnews"
                            exact
                        />
                        <Route
                            path="/editnews/:id"
                            component={isLoginAuthor ? EditNews : Login}
                            exact
                        />
                        <Route
                            component={isLoginAuthor ? MyDraft : Login}
                            path="/mydraft"
                            exact
                        />{" "}
                        {/* publisher */}
                        <Route
                            component={
                                isLoginPublisher ? DashboardPublisher : Login
                            }
                            path="/dashboardpublisher"
                            exact
                        />
                        <Route
                            component={isLoginPublisher ? Trending : Login}
                            path="/trending/:id"
                            exact
                        />
                        <Route
                            component={isLoginPublisher ? UserList : Login}
                            path="/userlist"
                            exact
                        />
                        <Route
                            component={isLoginPublisher ? CreateUser : Login}
                            path="/createuser"
                            exact
                        />
                        <Route
                            component={isLoginPublisher ? EditUser : Login}
                            path="/edituser/:id"
                            exact
                        />
                        <Route
                            component={isLoginPublisher ? Proposal : Login}
                            path="/proposal"
                            exact
                        />
                        <Route
                            component={
                                isLoginPublisher ? UnapprovedNews : Login
                            }
                            path="/unapprovednews/:id"
                            exact
                        />
                    </Switch>
                </div>
            </ApolloProvider>
        </BrowserRouter>
    );
};

export default App;
