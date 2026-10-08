import LoginForm from "@/components/LoginForm";
import { getLocale } from "@/lib/i18n";

export default async function LoginPage() {
  return <LoginForm locale={await getLocale()} />;
}
