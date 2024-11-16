import {Check, X} from 'lucide-react'
import React from 'react'

const PasswordCriteria = ({password}) => {

    const criteria = [
        { text: "At least 6 characters", condition: password.length >= 6},
        { text: "Contains uppercase letter", condition: /[A-Z]/.test(password)},
        { text: "Contains lowercase letter", condition: /[a-z]/.test(password)},
        { text: "At least 6 characters", condition: /[0-9]/.test(password)},
        { text: "At least 6 characters", condition: /[^A-Za-z0-9]/.test(password)}
    ]

    return(
        <div className='mt-2 space-y-1'>
            {criteria.map((eachVal, index) => (
                <div key={index} className='flex items-center text-xs'>
                    {eachVal.condition ? (
                        <Check className='size-4 text-green-400 mr-2' />
                    ): (
                        <X className='size-4 text-gray-500 mr-2' />
                    )}
                    <span className={eachVal.condition ? "text-green-500" : "text-gray-400"}>{eachVal.text}</span>
                </div>
            ))}
        </div>
    )

}

function PasswordStrengthMeter({password}) {

    const getStrength = (pass) => {
        let strength = 0;
        if(pass.length >= 6) strength++;
        if(/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength++;
        if(/[0-9]/.test(pass)) strength++;
        if(/[^A-Za-z0-9]/.test(pass)) strength++;

        return strength;
    }

    const strength = getStrength(password);

    const getColor = (strength) => {
		if (strength === 0) return "bg-red-500";
		if (strength === 1) return "bg-red-400";
		if (strength === 2) return "bg-yellow-500";
		if (strength === 3) return "bg-yellow-400";
		return "bg-green-500";
	};

	const getStrengthText = (strength) => {
		if (strength === 0) return "Very Weak";
		if (strength === 1) return "Weak";
		if (strength === 2) return "Fair";
		if (strength === 3) return "Good";
		return "Strong";
	};

  return (
    <div className='mt-2'>

        <div className='flex justify-between items-center mb-1'>
            <span className='text-xs text-gray-400'>Password strength</span>
            <span className='text-xs text-gray-400'>{getStrengthText(strength)}</span>
        </div>

        <div className='flex space-x-1'>
				{[...Array(4)].map((_, index) => (
					<div
						key={index}
						className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}
              `}
					/>
				))}
		</div>
			<PasswordCriteria password={password} />
	</div>
  )
}

export default PasswordStrengthMeter
