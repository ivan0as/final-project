import img_loading from './icon-loading.png';
import css from './loading.module.css';

export default function Loading() {
    return (
        <div className={css.loading}>
            <img src={img_loading} alt='загрузка'/>
        </div>
    );
}