import { useNavigate } from "react-router-dom";
import { logout } from "../../lib/auth";
import { Dialog } from "../ui/dialog";
import { Button } from "../ui/button";

export function Logout() {
  const navigate = useNavigate();

  function onClick() {
    logout();
    navigate("/login");
  }

  return (
    <Dialog
      trigger={<Button>Вийти</Button>}
      title={"Вийти з адмінпанелі?"}
      description={
        "Ви впевнені? Для повторного доступу потрібно буде знову ввести пароль"
      }
      onActionClick={onClick}
    />
  );
}
