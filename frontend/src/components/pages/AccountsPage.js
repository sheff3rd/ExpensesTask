import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoadingIndicator from "../common/LoadingIndicator";
import ErrorMessage from '../common/ErrorMessage';
import request from '../../request';
import styles from "./AccountsPage.module.css";
import Button from '../common/Button';

function AccountRow({ account }) {
  return (
    <li className={styles.item}>
      <Link to={`/account/${account.id}`} className={styles.itemInner}>
        <div className={styles.nameText}>
          {account.name}
        </div>

        <div className={styles.numberText}>
          {account.number}
        </div>

        <div className={styles.balanceText}>
          ${account.balance.toFixed(2)}
        </div>
      </Link>
    </li>
  );
}

function AccountList({ accounts }) {
  const _renderEmpty = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateMessage}>
        You don't have any accounts.
      </div>
    </div>
  );

  const _renderList = () => (
    <ul className={styles.list}>
      {accounts.map((account) => (
        <AccountRow key={account.id} account={account} />
      ))}
    </ul>
  );

  return (
    <>
      {!!accounts.length ? _renderList() : _renderEmpty()}

      <div className={styles.actions}>
        <Button to={"/accounts/new"}>New Account</Button>
      </div>
    </>
  )
}

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(function() {
    async function loadAccounts() {
      const response = await request("/accounts", {
        method: "GET",
      });

      if (response.ok) {
        setAccounts(response.body);
        setStatus("loaded");
      } else {
        setStatus("error");
      }
    }

    loadAccounts();
  }, [])

  if (status === "loading") {
    return <LoadingIndicator />;
  }

  if (status === "loaded") {
    return <AccountList accounts={accounts} />;
  }

  if (status === "error") {
    return <ErrorMessage />;
  }

  throw new Error(`Unexpected status: ${status}`);
}

export default AccountsPage;
