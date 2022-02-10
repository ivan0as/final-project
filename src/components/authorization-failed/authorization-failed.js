import css from './authorization-failed.module.css';

export default function AuthorizationFailed() {
    return (
        <div className={css.authorization_failed}>
            <p>Данная страница для авторизованных пользователей</p>
        </div>
    );
}