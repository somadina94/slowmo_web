import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../app/store";
import { setSession } from "../../features/auth/authSlice";
import {
  forgotPasswordRequest,
  loginRequest,
  registerRequest,
  resetPasswordRequest,
  verifyLoginRequest,
  type LoginChallenge,
  type TokenPair,
} from "../../lib/api";
import { notifySuccess } from "../../lib/toast";
import { isStaffRole } from "../../lib/status";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import { BusyButton } from "../../components/BusyButton";

export async function finishAuth(
  pair: { access_token: string; refresh_token: string; user: { role: string } },
  dispatch: (action: ReturnType<typeof setSession>) => void,
  navigate: (path: string) => void,
) {
  dispatch(setSession({ user: pair.user as never, accessToken: pair.access_token, refreshToken: pair.refresh_token }));
  navigate(isStaffRole(pair.user.role) ? "/admin" : "/preorder");
}

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staff, setStaff] = useState(false);
  const [challenge, setChallenge] = useState<LoginChallenge | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submitCredentials = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const next = await loginRequest(email, password, staff);
      setChallenge(next);
      setCode("");
      notifySuccess(`Code sent to ${next.email_hint}`);
    } catch {
      setError("Invalid credentials");
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const pair: TokenPair = await verifyLoginRequest(challenge!.challenge_id, code);
      notifySuccess("Welcome back");
      await finishAuth(pair, dispatch, navigate);
    } catch {
      setError("Invalid or expired code");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Nav />
      {!challenge ? (
        <form className="mx-auto max-w-md px-6 py-20" onSubmit={(e) => void submitCredentials(e)}>
          <h2 className="mb-6">Welcome back.</h2>
          {error && <p className="mb-3 text-[color:var(--berry)]">{error}</p>}
          <input
            className="field-input mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="field-input mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="mb-4 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={staff} onChange={(e) => setStaff(e.target.checked)} /> Staff login
          </label>
          <BusyButton className="btn btn-primary w-full justify-center" type="submit" busy={busy}>
            Continue
          </BusyButton>
          <p className="mt-4 text-sm">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
          <p className="mt-2 text-sm">
            New here? <Link to="/register">Create an account</Link>
          </p>
        </form>
      ) : (
        <form className="mx-auto max-w-md px-6 py-20" onSubmit={(e) => void submitCode(e)}>
          <h2 className="mb-2">Check your email.</h2>
          <p className="mb-6 text-sm text-[color:var(--ink-3)]">We sent a 6-digit code to {challenge.email_hint}.</p>
          {error && <p className="mb-3 text-[color:var(--berry)]">{error}</p>}
          <input
            className="field-input mb-3 tracking-[0.35em] text-center text-xl"
            placeholder="000000"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          <BusyButton
            className="btn btn-primary w-full justify-center"
            type="submit"
            busy={busy}
            disabled={code.length !== 6}
          >
            Verify & log in
          </BusyButton>
          <button
            type="button"
            className="mt-4 text-sm underline"
            onClick={() => {
              setChallenge(null);
              setCode("");
              setError("");
            }}
          >
            Use a different account
          </button>
        </form>
      )}
      <Footer />
    </>
  );
}

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const pair = await registerRequest({ name, email, password });
      notifySuccess("Account created");
      await finishAuth(pair, dispatch, navigate);
    } catch {
      setError("Could not register");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Nav />
      <form className="mx-auto max-w-md px-6 py-20" onSubmit={(e) => void submit(e)}>
        <h2 className="mb-6">Create your Slow Mo account.</h2>
        {error && <p className="mb-3 text-[color:var(--berry)]">{error}</p>}
        <input
          className="field-input mb-3"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="field-input mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="field-input mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <BusyButton className="btn btn-primary w-full justify-center" type="submit" busy={busy}>
          Register
        </BusyButton>
        <p className="mt-4 text-sm">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
      <Footer />
    </>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await forgotPasswordRequest(email);
      setDone(true);
      notifySuccess("Check your email");
    } catch {
      setDone(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Nav />
      <form className="mx-auto max-w-md px-6 py-20" onSubmit={(e) => void submit(e)}>
        <h2 className="mb-6">Forgot password</h2>
        {done ? (
          <p className="text-sm">If that email is registered, we sent reset instructions.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-[color:var(--ink-3)]">Enter your email and we’ll send a reset link.</p>
            <input
              className="field-input mb-3"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <BusyButton className="btn btn-primary w-full justify-center" type="submit" busy={busy}>
              Send reset link
            </BusyButton>
          </>
        )}
        <p className="mt-4 text-sm">
          <Link to="/login">Back to login</Link>
        </p>
      </form>
      <Footer />
    </>
  );
}

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = useMemo(() => params.get("token") || "", [params]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) {
      setError("Missing reset token");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await resetPasswordRequest(token, password);
      notifySuccess("Password updated");
      navigate("/login");
    } catch {
      setError("Could not reset password");
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Nav />
      <form className="mx-auto max-w-md px-6 py-20" onSubmit={(e) => void submit(e)}>
        <h2 className="mb-6">Choose a new password</h2>
        {error && <p className="mb-3 text-[color:var(--berry)]">{error}</p>}
        <input
          className="field-input mb-3"
          type="password"
          placeholder="New password (8+ chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <BusyButton
          className="btn btn-primary w-full justify-center"
          type="submit"
          busy={busy}
          disabled={password.length < 8}
        >
          Update password
        </BusyButton>
      </form>
      <Footer />
    </>
  );
}
