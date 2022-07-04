import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HeadlessTippy from '@tippyjs/react/headless'
import classNames from 'classnames/bind'
import { useEffect, useRef, useState } from 'react'
import AccountItem from '~/components/AccountItem'
import { SearchIcon } from '~/components/Icons'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import styles from './Search.module.scss'

import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons'
const cx = classNames.bind(styles)

const Search = () => {
    const [searchResult, setSearchResult] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [showResult, setShowReasult] = useState(true)
    const [loading, setLoading] = useState(false)

    const inputRef = useRef()

    useEffect(() => {
        if (!searchValue.trim()) {
            setSearchResult([])
            return
        }
        setLoading(true)
        fetch(`https://tiktok.fullstack.edu.vn/api/users/search?q=${encodeURIComponent(searchValue)}&type=more`)
            .then((res) => res.json())
            .then((res) => {
                setSearchResult(res.data)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
    }, [searchValue])

    const handeleClear = () => {
        setSearchValue('')
        inputRef.current.focus()
    }

    const handleHideResult = () => {
        setShowReasult(false)
    }
    return (
        <HeadlessTippy
            interactive
            visible={showResult && searchResult.length > 0}
            render={(attrs) => (
                <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                    <PopperWrapper>
                        <h4 className={cx('search-title')}>Accounts</h4>
                        {searchResult.map((result) => (
                            <AccountItem key={result.id} data={result} />
                        ))}
                    </PopperWrapper>
                </div>
            )}
            onClickOutside={handleHideResult}
        >
            <div className={cx('search')}>
                <input
                    ref={inputRef}
                    placeholder="Search accounts and videos"
                    spellCheck={false}
                    value={searchValue}
                    onChange={(e) => {
                        if (e.target.value.startsWith(' ')) {
                            return
                        } else {
                            setSearchValue(e.target.value)
                        }
                    }}
                    onFocus={() => setShowReasult(true)}
                />
                {!!searchValue && !loading && (
                    <button className={cx('clear')} onClick={handeleClear}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                    </button>
                )}
                {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}

                <button className={cx('search-btn')}>
                    <SearchIcon />
                </button>
            </div>
        </HeadlessTippy>
    )
}

export default Search
