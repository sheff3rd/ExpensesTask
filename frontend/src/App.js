import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
} from "react-router-dom";
import styles from "./App.module.css";
import ExpensesPage from "./components/pages/ExpensesPage";
import ExpenseEdit from "./components/pages/ExpenseEdit";
import AccountsPage from "./components/pages/AccountsPage";
import AccountEdit from './components/pages/AccountEdit';
import Notifications from "./components/common/Notifications";

function App() {
  return (
    <Router>
      <Notifications>
        <div className={styles.app}>
          <nav className={styles.mainNav}>
            <div className={styles.navInner}>
              <h1 className={styles.title}>Expense Tracker</h1>

              <ul>
                <li>
                  <Link to={"/"}>Expenses</Link>
                </li>
                <li>
                  <Link to={"/accounts"}>Accounts</Link>
                </li>
              </ul>
            </div>
          </nav>

          <main className={styles.main}>
            <Switch>
              <Route exact path={"/"}>
                <Redirect to={"/expenses"} />
              </Route>

              <Route exact path={"/expenses"}>
                <ExpensesPage />
              </Route>
              <Route exact path={"/expense/new"}>
                <ExpenseEdit />
              </Route>
              <Route exact path={"/expense/:id"}>
                <ExpenseEdit />
              </Route>

              <Route exact path={"/accounts"}>
                <AccountsPage />
              </Route>
              <Route exact path={"/accounts/new"}>
                <AccountEdit />
              </Route>
              <Route exact path={"/account/:id"}>
                <AccountEdit />
              </Route>
            </Switch>
          </main>
        </div>
      </Notifications>
    </Router>
  );
}

export default App;
