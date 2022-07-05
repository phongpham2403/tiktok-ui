import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import HeadlessTippy from '@tippyjs/react/headless'
import classNames from 'classnames/bind'
import { useEffect, useRef, useState } from 'react'
import AccountItem from '~/components/AccountItem'
import { SearchIcon } from '~/components/Icons'
import { Wrapper as PopperWrapper } from '~/components/Popper'
import styles from './Search.module.scss'

import * as searchServices from '~/services/searchService'

import { faCircleXmark, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '~/hooks'
const cx = classNames.bind(styles)

const Search = () => {
    const [searchResult, setSearchResult] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [showResult, setShowReasult] = useState(true)
    const [loading, setLoading] = useState(false)

    const debounced = useDebounce(searchValue, 500)

    const inputRef = useRef()

    useEffect(() => {
        if (!debounced.trim()) {
            setSearchResult([])
            return
        }

        const fetchApi = async () => {
            setLoading(true)
            const result = await searchServices.search(debounced)
            setSearchResult(result)
            setLoading(false)
        }
        fetchApi()
    }, [debounced])

    const handleClear = () => {
        setSearchValue('')
        inputRef.current.focus()
    }

    const handleHideResult = () => {
        setShowReasult(false)
    }

    const handleChange = (e) => {
        const searchValue = e.target.value
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue)
        }
    }

    return (
        <div>
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
                        onChange={handleChange}
                        onFocus={() => setShowReasult(true)}
                    />
                    {!!searchValue && !loading && (
                        <button className={cx('clear')} onClick={handleClear}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    )}
                    {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}

                    <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                        <SearchIcon />
                    </button>
                </div>
            </HeadlessTippy>
        </div>
    )
}

export default Search
