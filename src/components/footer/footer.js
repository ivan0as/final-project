import { COMPANY } from '../../config';
import css from './footer.module.css';
import css_app from '../app/app.module.css';

export default function Footer() {
    return (
        <footer className={css.footer}>
            <div className={`${css_app.container} ${css.footer_content}`}>
                <p>{COMPANY}</p>
            </div>
        </footer>
    );
}