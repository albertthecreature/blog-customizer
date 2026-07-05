import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Text } from 'src/ui/text';

import styles from './ArticleParamsForm.module.scss';
import { useRef, useState, useEffect, FormEvent } from 'react';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import {
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontFamilyOptions,
	OptionType,
	fontSizeOptions,
	ArticleStateType,
	defaultArticleState,
} from 'src/constants/articleProps';
import clsx from 'clsx';

type ArticleParamsFormProps = {
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: ArticleParamsFormProps) => {
	const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
	const formRef = useRef<HTMLDivElement>(null);

	const [articleStates, setArticleStates] =
		useState<ArticleStateType>(defaultArticleState);

	const toggleSidebar = () => {
		setIsFormOpen(!isFormOpen);
	};

	useEffect(() => {
		const closeSidebar = (event: MouseEvent) => {
			const { target } = event;

			if (target instanceof Node && !formRef.current?.contains(target)) {
				setIsFormOpen(false);
			}
		};

		if (!isFormOpen) {
			return;
		}

		window.addEventListener('mousedown', closeSidebar);

		return () => {
			window.removeEventListener('mousedown', closeSidebar);
		};
	}, [isFormOpen]);

	const changeField =
		(field: keyof ArticleStateType) => (option: OptionType) => {
			setArticleStates((prev) => ({ ...prev, [field]: option }));
		};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onApply(articleStates);
	};

	const handleReset = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setArticleStates(defaultArticleState);
		onApply(defaultArticleState);
	};

	return (
		<div ref={formRef}>
			<ArrowButton isOpen={isFormOpen} onClick={toggleSidebar} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text as={'h1'} size={31} weight={800} uppercase>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={articleStates.fontFamilyOption}
						placeholder={articleStates.fontFamilyOption.title}
						onChange={changeField('fontFamilyOption')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						options={fontSizeOptions}
						selected={articleStates.fontSizeOption}
						onChange={changeField('fontSizeOption')}
					/>
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={articleStates.fontColor}
						placeholder={articleStates.fontColor.title}
						onChange={changeField('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={articleStates.backgroundColor}
						placeholder={articleStates.backgroundColor.title}
						onChange={changeField('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={articleStates.contentWidth}
						placeholder={articleStates.contentWidth.title}
						onChange={changeField('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
