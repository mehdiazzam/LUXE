import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, LockKeyhole, LogOut, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/auth-context";
import { formatPrice } from "@/lib/api";
import { useCart } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Header } from "@/components/site/header";

const STEPS = ["Shipping", "Payment", "Review"] as const;

type ShippingDetails = {
  email: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  country: string;
};

type PaymentDetails = {
  card: string;
  exp: string;
  cvc: string;
  name: string;
};

export function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [ship, setShip] = useState<ShippingDetails>({
    email: user?.email ?? "",
    name: user?.displayName ?? "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });
  const [pay, setPay] = useState<PaymentDetails>({ card: "", exp: "", cvc: "", name: "" });

  const sub = subtotal();
  const shipping = sub > 200 ? 0 : 12;
  const totals = { sub, shipping, total: sub + shipping };

  if (!items.length) {
    return (
      <>
        <Header />
        <div className="mx-auto flex min-h-[72vh] max-w-2xl flex-col items-center justify-center px-4 pt-16 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Checkout</p>
          <h1 className="font-display mt-3 text-4xl">Nothing to checkout</h1>
          <Link
            to="/shop"
            className="mt-6 rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:opacity-90"
          >
            Go to shop
          </Link>
        </div>
      </>
    );
  }

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const placeOrder = () => {
    const orderId = `LX-${Date.now().toString(36).toUpperCase().slice(-8)}`;
    clear();
    navigate({ to: "/checkout/success", search: { id: orderId } });
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-6xl px-4 pt-28 pb-14 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-5 border-b border-hairline pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Secure checkout
            </p>
            <h1 className="font-display mt-3 text-4xl sm:text-5xl">Complete your order</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-2">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald" />
              Protected sign in
            </span>
            {user ? (
              <button
                onClick={() => void logout()}
                className="inline-flex items-center gap-2 rounded-full border border-hairline px-3 py-2 transition hover:border-gold hover:text-gold"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            ) : null}
          </div>
        </header>

        {loading || !user ? (
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <CheckoutAuthGate />
            </div>
            <aside className="lg:col-span-5">
              <OrderSummary totals={totals} compact />
            </aside>
          </div>
        ) : (
          <>
            <Stepper step={step} />
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="mb-6 rounded-lg border border-hairline bg-surface/40 p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="mt-1 text-foreground">{user.email}</p>
                </div>

                {step === 0 ? <ShippingForm ship={ship} setShip={setShip} onSubmit={next} /> : null}

                {step === 1 ? (
                  <PaymentForm pay={pay} setPay={setPay} onBack={back} onSubmit={next} />
                ) : null}

                {step === 2 ? (
                  <ReviewStep
                    ship={ship}
                    pay={pay}
                    total={totals.total}
                    onBack={back}
                    onPlaceOrder={placeOrder}
                  />
                ) : null}
              </div>

              <aside className="lg:col-span-5">
                <OrderSummary totals={totals} />
              </aside>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function CheckoutAuthGate() {
  const { configured, loading, signInWithGoogle, signInWithEmail, createAccount } = useAuth();
  const [mode, setMode] = useState<"signin" | "create">("signin");
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    try {
      if (mode === "create") {
        await createAccount(form.name, form.email, form.password);
        toast.success("Account created. Checkout is ready.");
      } else {
        await signInWithEmail(form.email, form.password);
        toast.success("Welcome back. Checkout is ready.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="rounded-lg border border-hairline bg-surface/40 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-full border border-hairline bg-background p-3 text-gold">
          <LockKeyhole className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Firebase login</p>
          <h2 className="font-display mt-2 text-3xl">Sign in to continue</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            We ask for an account only when checkout starts, so the bag stays fast and the order
            details are attached to a verified customer.
          </p>
        </div>
      </div>

      {!configured ? (
        <div className="mt-6 rounded-md border border-gold/30 bg-gold/10 p-4 text-sm text-gold-soft">
          Add your Firebase web app keys to `.env.local` before real login can run.
        </div>
      ) : null}

      <div className="mt-8 grid grid-cols-2 rounded-full border border-hairline p-1">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={cn(
            "rounded-full px-4 py-2 text-sm transition",
            mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("create")}
          className={cn(
            "rounded-full px-4 py-2 text-sm transition",
            mode === "create" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
          )}
        >
          Create account
        </button>
      </div>

      <button
        type="button"
        disabled={!configured || loading || pending}
        onClick={async () => {
          setPending(true);
          try {
            await signInWithGoogle();
            toast.success("Signed in with Google.");
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "Google sign in failed.");
          } finally {
            setPending(false);
          }
        }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-hairline px-5 py-3 text-sm font-medium transition hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Mail className="h-4 w-4" />
        Continue with Google
      </button>

      <form onSubmit={submit} className="mt-5 space-y-4">
        {mode === "create" ? (
          <Field
            label="Full name"
            value={form.name}
            onChange={(name) => setForm((current) => ({ ...current, name }))}
            required
          />
        ) : null}
        <Field
          label="Email"
          type="email"
          value={form.email}
          onChange={(email) => setForm((current) => ({ ...current, email }))}
          required
        />
        <Field
          label="Password"
          type="password"
          value={form.password}
          onChange={(password) => setForm((current) => ({ ...current, password }))}
          required
        />
        <button
          type="submit"
          disabled={!configured || pending}
          className="w-full rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? "Working..." : mode === "create" ? "Create account" : "Sign in"}
        </button>
      </form>
    </section>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mb-10 grid gap-3 sm:grid-cols-3">
      {STEPS.map((label, i) => (
        <li
          key={label}
          className={cn(
            "flex items-center gap-3 rounded-lg border p-4",
            i <= step ? "border-gold/40 bg-surface/60" : "border-hairline bg-transparent",
          )}
        >
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
              i < step && "border-gold bg-gold text-primary-foreground",
              i === step && "border-gold text-gold",
              i > step && "border-hairline text-muted-foreground",
            )}
          >
            {i < step ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
        </li>
      ))}
    </ol>
  );
}

function ShippingForm({
  ship,
  setShip,
  onSubmit,
}: {
  ship: ShippingDetails;
  setShip: (ship: ShippingDetails) => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Email"
          value={ship.email}
          onChange={(email) => setShip({ ...ship, email })}
          type="email"
          required
        />
        <Field
          label="Full name"
          value={ship.name}
          onChange={(name) => setShip({ ...ship, name })}
          required
        />
      </div>
      <Field
        label="Address"
        value={ship.address}
        onChange={(address) => setShip({ ...ship, address })}
        required
      />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="City"
          value={ship.city}
          onChange={(city) => setShip({ ...ship, city })}
          required
        />
        <Field
          label="Postal code"
          value={ship.zip}
          onChange={(zip) => setShip({ ...ship, zip })}
          required
        />
        <Field
          label="Country"
          value={ship.country}
          onChange={(country) => setShip({ ...ship, country })}
          required
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        Continue to payment
      </button>
    </form>
  );
}

function PaymentForm({
  pay,
  setPay,
  onBack,
  onSubmit,
}: {
  pay: PaymentDetails;
  setPay: (pay: PaymentDetails) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-5"
    >
      <Field
        label="Card number"
        value={pay.card}
        onChange={(card) => setPay({ ...pay, card })}
        placeholder="4242 4242 4242 4242"
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Expiry"
          value={pay.exp}
          onChange={(exp) => setPay({ ...pay, exp })}
          placeholder="MM/YY"
          required
        />
        <Field
          label="CVC"
          value={pay.cvc}
          onChange={(cvc) => setPay({ ...pay, cvc })}
          placeholder="123"
          required
        />
      </div>
      <Field
        label="Name on card"
        value={pay.name}
        onChange={(name) => setPay({ ...pay, name })}
        required
      />
      <p className="text-xs text-muted-foreground">Mock checkout. No real charges are made.</p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-hairline px-7 py-3 text-sm hover:border-gold"
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Review order
        </button>
      </div>
    </form>
  );
}

function ReviewStep({
  ship,
  pay,
  total,
  onBack,
  onPlaceOrder,
}: {
  ship: ShippingDetails;
  pay: PaymentDetails;
  total: number;
  onBack: () => void;
  onPlaceOrder: () => void;
}) {
  return (
    <div className="space-y-6">
      <Section title="Shipping to">
        <p>{ship.name}</p>
        <p>{ship.address}</p>
        <p>
          {ship.city}, {ship.zip}, {ship.country}
        </p>
        <p>{ship.email}</p>
      </Section>
      <Section title="Payment">
        <p>•••• •••• •••• {pay.card.slice(-4) || "0000"}</p>
        <p>{pay.name}</p>
      </Section>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onBack}
          className="rounded-full border border-hairline px-7 py-3 text-sm hover:border-gold"
        >
          Back
        </button>
        <button
          onClick={onPlaceOrder}
          className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Place order — {formatPrice(total)}
        </button>
      </div>
    </div>
  );
}

function OrderSummary({
  totals,
  compact = false,
}: {
  totals: { sub: number; shipping: number; total: number };
  compact?: boolean;
}) {
  const items = useCart((s) => s.items);

  return (
    <div className="sticky top-24 rounded-lg border border-hairline bg-surface/50 p-6 shadow-luxe">
      <h2 className="font-display text-2xl">Order summary</h2>
      <ul className="mt-5 divide-y divide-hairline">
        {items.map(({ product, qty }) => (
          <li key={product.id} className="flex gap-3 py-3">
            <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded bg-surface">
              <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 justify-between gap-3 text-sm">
              <div>
                <p className="line-clamp-1">{product.title}</p>
                <p className="text-xs text-muted-foreground">Qty {qty}</p>
              </div>
              <p className="text-gold">{formatPrice(product.price * qty)}</p>
            </div>
          </li>
        ))}
      </ul>
      <dl className="mt-6 space-y-2 border-t border-hairline pt-5 text-sm">
        <Row k="Subtotal" v={formatPrice(totals.sub)} />
        <Row k="Shipping" v={totals.shipping ? formatPrice(totals.shipping) : "Free"} />
      </dl>
      <div className="mt-4 flex items-end justify-between border-t border-hairline pt-4">
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</span>
        <span className="font-display text-3xl text-gold">{formatPrice(totals.total)}</span>
      </div>
      {compact ? (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Sign in to choose shipping, payment, and review the final order.
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-hairline bg-surface px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
    </label>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface/40 p-6">
      <h3 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{title}</h3>
      <div className="mt-3 space-y-1 text-sm">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <dt>{k}</dt>
      <dd className="text-foreground">{v}</dd>
    </div>
  );
}
