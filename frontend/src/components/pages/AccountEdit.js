import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import LoadingIndicator from '../common/LoadingIndicator';
import ErrorMessage from '../common/ErrorMessage';
import request from '../../request';
import styles from './AccountEdit.module.css';
import Button from '../common/Button';
import { useNotifications } from '../common/Notifications';

function AccountForm({ account, onCreate, onUpdate, disabled, onDelete }) {
  const [changes, setChanges] = useState({});

  function changeField(field, value) {
    setChanges({ ...changes, [field]: value });
  }

  const formData = { ...account, ...changes };

  function handleSubmit(event) {
    event.preventDefault();

    account.id ? onUpdate(formData) : onCreate(formData);
  }

  return (
    <form autoComplete={"off"} onSubmit={handleSubmit} className={styles.form}>
      <fieldset disabled={disabled && "disabled"}>
        <div className={styles.formRow}>
          <label htmlFor="name">Name</label>
          <input
            required
            id="name"
            type="text"
            value={formData.name}
            onChange={(event) => changeField('name', event.target.value)}
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="number">Number</label>
          <input
            required
            id="number"
            type="text"
            value={formData.number}
            onChange={(event) => changeField('number', event.target.value)}
          />
        </div>

        <div className={styles.formRow}>
          <label htmlFor="balance">Balance</label>
          <input
            disabled
            id="balance"
            type="number"
            value={formData.balance}
            onChange={(event) => changeField('balance', event.target.value)}
          />
        </div>
      </fieldset>

      <div className={styles.formFooter}>
        {account.id && (
          <Button action={onDelete} kind="danger" disabled={disabled}>
            Delete
          </Button>
        )}

        <Button
          type="submit"
          disabled={Object.keys(changes).length === 0 || disabled}>
          Save
        </Button>
      </div>
    </form>
  );
}

const defaultAccountData = {
  name: "",
  number: "",
  balance: 1000,
};

function AccountEdit() {
  const { id } = useParams();
  const history = useHistory();
  const [account, setAccount] = useState(id ? null : defaultAccountData);
  const [status, setStatus] = useState(id ? "loading" : "loaded");
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const { notifyError } = useNotifications();

  useEffect(function () {
    async function loadAccount() {
      try {
        const response = await request(`/accounts/${id}`, {
          method: "GET"
        });

        if (response.ok) {
          setAccount(response.body);
          setStatus("loaded");
        } else {
          setStatus("error");
        }
      } catch (error) {
        setStatus("error");
      }
    }

    if (id) {
      loadAccount();
    }
  }, [id]);

  async function handleCreate(changes) {
    try {
      setSaving(true);

      const response = await request('/accounts', {
        method: 'POST',
        body: { ...defaultAccountData, ...changes }
      });

      if (response.ok) {
        setAccount(response.body);
      } else {
        notifyError('Failed to save account. Please try again');
      }
    } catch (error) {
      notifyError(
        "Failed to save account. Unexpected error occurred"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(changes) {
    try {
      setSaving(true);

      const response = await request(`/accounts/${account.id}`, {
        method: "PATCH",
        body: changes
      });

      if (response.ok) {
        setAccount(response.body);
      } else {
        notifyError("Failed to save account. Please try again");
      }
    } catch (error) {
      notifyError(
        "Failed to save account. Unexpected error occurred"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(changes) {
    try {
      setDeleting(true);
      const response = await request(`/accounts/${account.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        history.push('/accounts');
      } else {
        notifyError('Failed to delete account. Please try again');
      }
    } catch (error) {
      notifyError(
        "Failed to delete account. Unexpected error occurred"
      );
    } finally {
      setDeleting(false);
    }
  }

  if (status === "loading") {
    return <LoadingIndicator />;
  }

  if (status === 'loaded') {
    return (
      <AccountForm
        key={account.updated_at}
        account={account}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        disabled={isSaving || isDeleting}
      />
    );
  }

  if (status === "error") {
    return <ErrorMessage />;
  }

  throw new Error(`Unexpected status: ${status}`);
}

export default AccountEdit;
