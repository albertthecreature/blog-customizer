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

type ArticleProps = {
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: ArticleProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const formRef = useRef<HTMLDivElement>(null);

	const [articleStates, setArticleStates] =
		useState<ArticleStateType>(defaultArticleState);

	const handleButton = () => {
		setIsOpen(!isOpen);
	};

	useEffect(() => {
		const click = (event: MouseEvent) => {
			const { target } = event;

			if (target instanceof Node && !formRef.current?.contains(target)) {
				setIsOpen(false);
			}
		};

		if (!isOpen) {
			return;
		}

		window.addEventListener('mousedown', click);

		return () => {
			window.removeEventListener('mousedown', click);
		};
	}, [isOpen]);

	const fieldChange =
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
			<ArrowButton isOpen={isOpen} onClick={handleButton} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
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
						onChange={fieldChange('fontFamilyOption')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='font-size'
						options={fontSizeOptions}
						selected={articleStates.fontSizeOption}
						onChange={fieldChange('fontSizeOption')}
					/>
					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={articleStates.fontColor}
						placeholder={articleStates.fontColor.title}
						onChange={fieldChange('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={articleStates.backgroundColor}
						placeholder={articleStates.backgroundColor.title}
						onChange={fieldChange('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={articleStates.contentWidth}
						placeholder={articleStates.contentWidth.title}
						onChange={fieldChange('contentWidth')}
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
