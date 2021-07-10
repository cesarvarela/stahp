import React, { useCallback, useState } from 'react'

export default function Blocker() {

    const [canClose, setCanClose] = useState(false)

    window.onbeforeunload = useCallback((e) => {

        return canClose
    }, [canClose])

    const onClose = () => {

        window.stahpblocker.close()

        setCanClose(true)
        window.close()
    }

    return <div><button onClick={onClose}>close</button></div>
}